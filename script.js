// ---------- Data ----------
// Expenses are stored as objects inside one array.
const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Other"];

let budget = 20000;
let nextId = 4;
let expenses = [
  { id: 1, description: "Lunch", amount: 350, category: "Food" },
  { id: 2, description: "Matatu fare", amount: 200, category: "Transport" },
  { id: 3, description: "Airtime", amount: 500, category: "Bills" }
];

// ---------- Page elements ----------
const budgetDisplay = document.getElementById("budget-display");
const totalDisplay = document.getElementById("total-display");
const remainingDisplay = document.getElementById("remaining-display");
const progress = document.getElementById("progress");
const progressFill = document.getElementById("progress-fill");
const statusMessage = document.getElementById("status-message");

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const formError = document.getElementById("form-error");

const filterSelect = document.getElementById("filter");
const expenseList = document.getElementById("expense-list");
const clearBtn = document.getElementById("clear-btn");
const categoryList = document.getElementById("category-list");

// ---------- Helpers ----------
function formatKES(number) {
  return "KES " + number.toLocaleString("en-KE");
}

// Loop through the array and add up every amount.
function calculateTotal(list) {
  let total = 0;
  for (let i = 0; i < list.length; i++) {
    total += list[i].amount;
  }
  return total;
}

// Loop through the array and add each amount to its category.
function calculateCategoryTotals(list) {
  const totals = {};
  for (const name of CATEGORIES) {
    totals[name] = 0;
  }
  for (const expense of list) {
    totals[expense.category] += expense.amount;
  }
  return totals;
}

// Conditionals: choose feedback based on how much of the budget is used.
function getStatus(percentUsed) {
  if (percentUsed > 100) {
    return { level: "danger", text: "You are over budget. Try to hold off on extra spending." };
  } else if (percentUsed >= 80) {
    return { level: "warn", text: "Careful: you have used most of your budget." };
  } else if (percentUsed >= 50) {
    return { level: "warn", text: "You are past halfway. Keep an eye on spending." };
  } else {
    return { level: "ok", text: "You are on track. Nice work." };
  }
}

// ---------- Rendering (DOM updates) ----------
function renderSummary() {
  const total = calculateTotal(expenses);
  const remaining = budget - total;
  const percentUsed = budget > 0 ? (total / budget) * 100 : 0;
  const status = getStatus(percentUsed);

  budgetDisplay.textContent = formatKES(budget);
  totalDisplay.textContent = formatKES(total);
  remainingDisplay.textContent = formatKES(remaining);

  const barWidth = Math.min(percentUsed, 100);
  progressFill.style.width = barWidth + "%";
  progressFill.className = "bar-fill " + (status.level === "ok" ? "" : status.level);
  progress.setAttribute("aria-valuenow", Math.round(barWidth));

  statusMessage.textContent = status.text;
  statusMessage.className = "status " + status.level;
}

function renderList() {
  const selected = filterSelect.value;
  expenseList.innerHTML = "";

  let shown = 0;
  for (const expense of expenses) {
    // Skip expenses that do not match the filter.
    if (selected !== "All" && expense.category !== selected) {
      continue;
    }

    const item = document.createElement("li");
    item.className = "expense-item";

    const name = document.createElement("span");
    name.className = "expense-name";
    name.textContent = expense.description;

    const cat = document.createElement("span");
    cat.className = "expense-cat";
    cat.textContent = expense.category;
    name.appendChild(cat);

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = formatKES(expense.amount);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "Delete";
    del.dataset.id = expense.id;
    del.setAttribute("aria-label", "Delete " + expense.description);

    item.append(name, amount, del);
    expenseList.appendChild(item);
    shown++;
  }

  // Empty state
  if (shown === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = expenses.length === 0
      ? "No expenses yet. Add your first one above."
      : "No expenses in this category.";
    expenseList.appendChild(empty);
  }
}

function renderCategories() {
  const totals = calculateCategoryTotals(expenses);
  const overall = calculateTotal(expenses);
  categoryList.innerHTML = "";

  for (const name of CATEGORIES) {
    const share = overall > 0 ? (totals[name] / overall) * 100 : 0;

    const row = document.createElement("li");
    row.className = "category-row";

    const label = document.createElement("span");
    label.textContent = name;

    const barWrap = document.createElement("div");
    barWrap.className = "mini-bar";
    const barFill = document.createElement("div");
    barFill.className = "mini-bar-fill";
    barFill.style.width = share + "%";
    barWrap.appendChild(barFill);

    const amount = document.createElement("span");
    amount.className = "category-amount";
    amount.textContent = formatKES(totals[name]);

    row.append(label, barWrap, amount);
    categoryList.appendChild(row);
  }
}

// One function to refresh everything after any change.
function render() {
  renderSummary();
  renderList();
  renderCategories();
}

// ---------- Setup ----------
function fillSelects() {
  for (const name of CATEGORIES) {
    categorySelect.appendChild(new Option(name, name));
  }
  filterSelect.appendChild(new Option("All categories", "All"));
  for (const name of CATEGORIES) {
    filterSelect.appendChild(new Option(name, name));
  }
}

// ---------- Events (user actions) ----------
expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  // Conditionals: validate before saving.
  if (description === "") {
    formError.textContent = "Please enter what the expense was for.";
    return;
  }
  if (amountInput.value === "" || isNaN(amount) || amount <= 0) {
    formError.textContent = "Please enter an amount greater than 0.";
    return;
  }

  expenses.push({
    id: nextId++,
    description: description,
    amount: amount,
    category: categorySelect.value
  });

  formError.textContent = "";
  expenseForm.reset();
  descriptionInput.focus();
  render();
});

// One listener on the list handles every Delete button.
expenseList.addEventListener("click", function (event) {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }
  const id = Number(event.target.dataset.id);
  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });
  render();
});

filterSelect.addEventListener("change", renderList);

budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newBudget = Number(budgetInput.value);

  if (budgetInput.value === "" || isNaN(newBudget) || newBudget <= 0) {
    statusMessage.textContent = "Enter a budget greater than 0.";
    statusMessage.className = "status danger";
    return;
  }

  budget = newBudget;
  budgetForm.reset();
  render();
});

clearBtn.addEventListener("click", function () {
  if (expenses.length === 0) {
    return;
  }
  if (confirm("Remove all expenses?")) {
    expenses = [];
    render();
  }
});

// ---------- Start ----------
fillSelects();
render();