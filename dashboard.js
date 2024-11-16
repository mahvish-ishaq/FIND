// Sample financial data
const financialData = {
    income: 50000,
    expenses: {
        food: 8000,
        rent: 15000,
        entertainment: 5000,
        transportation: 3000,
        others: 2000
    }
};

// Display totals
document.getElementById("totalIncome").innerText = `Rs. ${financialData.income.toFixed(2)}`;
const totalExpenses = Object.values(financialData.expenses).reduce((sum, expense) => sum + expense, 0);
document.getElementById("totalExpenses").innerText = `Rs. ${totalExpenses.toFixed(2)}`;
document.getElementById("totalSavings").innerText = `Rs. ${(financialData.income - totalExpenses).toFixed(2)}`;

// Render expense chart
const ctx = document.getElementById("expenseChart").getContext("2d");
new Chart(ctx, {
    type: "pie",
    data: {
        labels: Object.keys(financialData.expenses),
        datasets: [
            {
                data: Object.values(financialData.expenses),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FFA500"],
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            }
        }
    }
});
