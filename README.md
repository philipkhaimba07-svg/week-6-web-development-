# SpendWise

SpendWise is a simple budgeting app that tracks expenses in Kenyan shillings (KES). You set a monthly budget, add expenses, and the dashboard shows how much you have spent, how much is left, and how you are doing.

## Improvements made this week

Last week SpendWise only worked with a few separate variables and printed results to the console. This week I turned it into an interactive app. Users can now set a budget, add and delete expenses, filter the list by category, and see a progress bar and a spending breakdown update on the page straight away. I also added a feedback message that tells the user whether they are on track or over budget.

## How conditionals are used

Conditionals make the app respond to the user's data. The `getStatus()` function uses `if / else if / else` to check what percentage of the budget has been used. Under 50% shows an "on track" message, 50% to 79% warns that the user is past halfway, 80% to 100% warns that most of the budget is gone, and above 100% says the user is over budget. The bar colour changes with the same result. Conditionals also validate the forms (an empty description or an amount of 0 or less shows an error), skip expenses that do not match the filter, and show an empty-state message when there is nothing to display.

## How arrays are used to store data

All expenses live in one array called `expenses`. Each item is an object with an `id`, `description`, `amount`, and `category`. Adding an expense uses `push()`, and deleting one uses `filter()` to build a new array without the removed item. A second array, `CATEGORIES`, holds the category names and is used to fill the dropdowns and the breakdown section, so no category is typed out twice.

## How loops are used

A `for` loop in `calculateTotal()` adds up every amount in the array. `for...of` loops go through the expenses to build the list on the page and to add each amount to its category in `calculateCategoryTotals()`. Loops are also used to fill the category dropdowns.

## How the DOM is updated

The page is updated through three render functions: `renderSummary()` updates the budget, spent, and remaining figures, the progress bar, and the status message. `renderList()` clears the expense list and rebuilds it with `createElement()` and `appendChild()`. `renderCategories()` rebuilds the category breakdown. A single `render()` function calls all three, so the page always matches the data after any change. Text is added with `textContent` rather than `innerHTML` so user input is never treated as HTML.

## How user interactions are handled through events

`addEventListener()` connects the page to the JavaScript logic:

- The expense form listens for `submit`, validates the input, adds the expense to the array, and calls `render()`.
- The budget form listens for `submit` and updates the budget.
- The expense list has one `click` listener that handles every Delete button, using each button's `data-id` to find the right expense.
- The category filter listens for `change` and redraws the list.
- The "Clear all expenses" button listens for `click` and asks for confirmation first.

The flow is always the same: the user acts, an event listener runs, the array is updated, and `render()` shows the result on the page.

## Challenges and how I solved them

**Challenge 1:** The page reloaded every time I submitted a form, which wiped out my data. I fixed this by calling `event.preventDefault()` at the start of each submit handler.

**Challenge 2:** Delete buttons are created by JavaScript, so I could not attach listeners to them in advance. I solved this by adding one click listener to the parent list and checking which button was clicked.

**Challenge 3:** Amounts from inputs are strings, which caused wrong totals. I converted them with `Number()` and checked for invalid values before saving.

## How to run

Open `index.html` in a browser. No installation is needed.