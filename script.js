const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const expSelect = document.getElementById("exp");
const balanceDisplay = document.getElementById("balance");
const creditDisplay = document.getElementById("show_credit");
const debitDisplay = document.getElementById("show_debit");
const listDisplay = document.getElementById("list");

let transactions = [];

async function loadTransactions() {
  try {
    const response = await fetch("/api/transactions");
    if (!response.ok) throw new Error("Could not load transactions");

    const data = await response.json();

    // Convert backend income/expense to the existing credit/debit labels.
    transactions = data.map(item => ({
      ...item,
      id: item._id,
      amount: Number(item.amount),
      type: item.type === "income" ? "credit" : "debit"
    }));

    updateBalance();
    renderTransactionHistory();
  } catch (error) {
    console.error(error);
    alert("Could not load transactions. Please check that the backend and MongoDB are running.");
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const description = textInput.value.trim();
  const amount = Number(amountInput.value);
  const type = expSelect.value;

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a description and a valid amount.");
    return;
  }

  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        amount,
        type: type === "credit" ? "income" : "expense"
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not save transaction");
    }

    textInput.value = "";
    amountInput.value = "";
    await loadTransactions();
  } catch (error) {
    console.error(error);
    alert("Transaction could not be saved. Check the backend and MongoDB.");
  }
});

function updateBalance() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(transaction => {
    if (transaction.type === "credit") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  balanceDisplay.textContent =
    `Rs. ${(totalIncome - totalExpense).toFixed(2)}`;
  creditDisplay.textContent = `Rs. ${totalIncome.toFixed(2)}`;
  debitDisplay.textContent = `Rs. ${totalExpense.toFixed(2)}`;
}

function renderTransactionHistory() {
  listDisplay.innerHTML = "";

  transactions.forEach(transaction => {
    const item = document.createElement("li");
    item.classList.add(
      transaction.type === "credit" ? "plus" : "minus"
    );

    const description = document.createElement("span");
    description.textContent = transaction.description;

    const amount = document.createElement("span");
    amount.textContent = `Rs. ${transaction.amount.toFixed(2)}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", () => {
      deleteTransaction(transaction.id);
    });

    item.append(description, amount, deleteButton);
    listDisplay.appendChild(item);
  });
}

async function deleteTransaction(id) {
  try {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Could not delete transaction");
    }

    await loadTransactions();
  } catch (error) {
    console.error(error);
    alert("Could not delete transaction. Please try again.");
  }
}

loadTransactions();
