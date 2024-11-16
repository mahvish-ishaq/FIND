// DOM Elements
const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const expSelect = document.getElementById("exp");
const balanceDisplay = document.getElementById("balance");
const creditDisplay = document.getElementById("show_credit");
const debitDisplay = document.getElementById("show_debit");
const listDisplay = document.getElementById("list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let totalIncome = 0;
let totalExpense = 0;

// Event Listener for form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const description = textInput.value;
  const amount = parseFloat(amountInput.value);
  const type = expSelect.value;

  if (description && !isNaN(amount)) {
    // Create a new transaction object
    const newTransaction = {
      id: Math.floor(Math.random() * 1000000),
      description,
      amount,
      type,
    };

    // Add the new transaction to the list of transactions
    transactions.push(newTransaction);

    // Update localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Update the balance and income/expense values
    updateBalance();

    // Update the transaction history
    renderTransactionHistory();

    // Clear the form
    textInput.value = "";
    amountInput.value = "";
  } else {
    alert("Please enter valid data.");
  }
});

// Function to update the balance, income, and expense
function updateBalance() {
  totalIncome = 0;
  totalExpense = 0;

  // Loop through the transactions and calculate the income and expenses
  transactions.forEach((transaction) => {
    if (transaction.type === "credit") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "debit") {
      totalExpense += transaction.amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;
  balanceDisplay.innerHTML = `Rs. ${totalBalance.toFixed(2)}`;
  creditDisplay.innerHTML = `Rs. ${totalIncome.toFixed(2)}`;
  debitDisplay.innerHTML = `Rs. ${totalExpense.toFixed(2)}`;
}

// Function to render the transaction history
function renderTransactionHistory() {
  listDisplay.innerHTML = "";

  // Loop through the transactions and create list items
  transactions.forEach((transaction) => {
    const listItem = document.createElement("li");
    listItem.classList.add(transaction.type === "credit" ? "plus" : "minus");
    listItem.innerHTML = `
      ${transaction.description} <span>Rs. ${transaction.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
    `;
    listDisplay.appendChild(listItem);
  });
}

// Function to delete a transaction
function deleteTransaction(id) {
  // Filter out the transaction from the array
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // Update localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Re-render the balance and history
  updateBalance();
  renderTransactionHistory();
}

// Initial render
updateBalance();
renderTransactionHistory();
