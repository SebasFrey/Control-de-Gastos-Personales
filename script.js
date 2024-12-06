// Elementos del DOM
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expensesElement = document.getElementById('expenses');
const categoryList = document.getElementById('category-list');
const transactionList = document.getElementById('transaction-list');
const filterSelect = document.getElementById('filter');
const expenseChart = document.getElementById('expense-chart');

// Estado de la aplicación
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let balance = 0;
let income = 0;
let expenses = 0;
let categorySummary = {};

// Funciones auxiliares
function updateBalance() {
    balance = income - expenses;
    balanceElement.textContent = balance.toFixed(2);
    incomeElement.textContent = income.toFixed(2);
    expensesElement.textContent = expenses.toFixed(2);
}

function updateCategorySummary() {
    categorySummary = {};
    transactions.forEach(transaction => {
        if (!categorySummary[transaction.category]) {
            categorySummary[transaction.category] = 0;
        }
        if (transaction.type === 'income') {
            categorySummary[transaction.category] += transaction.amount;
        } else {
            categorySummary[transaction.category] -= transaction.amount;
        }
    });

    categoryList.innerHTML = '';
    for (const [category, amount] of Object.entries(categorySummary)) {
        const li = document.createElement('li');
        li.textContent = `${category}: $${amount.toFixed(2)}`;
        categoryList.appendChild(li);
    }
}

function updateExpenseChart() {
    expenseChart.innerHTML = '';
    const expenseCategories = Object.entries(categorySummary).filter(([, amount]) => amount < 0);
    const totalExpenses = expenseCategories.reduce((total, [, amount]) => total + Math.abs(amount), 0);

    expenseCategories.forEach(([category, amount]) => {
        const percentage = (Math.abs(amount) / totalExpenses) * 100;
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${percentage}%`;
        bar.title = `${category}: $${Math.abs(amount).toFixed(2)} (${percentage.toFixed(2)}%)`;
        expenseChart.appendChild(bar);
    });
}

function addTransactionToDOM(transaction) {
    const li = document.createElement('li');
    li.className = `transaction-item ${transaction.type}`;
    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>$${transaction.amount.toFixed(2)}</span>
        <span>${transaction.category}</span>
    `;
    transactionList.appendChild(li);
}

function updateTransactionList() {
    transactionList.innerHTML = '';
    const filteredTransactions = transactions.filter(transaction => {
        return filterSelect.value === 'all' || transaction.type === filterSelect.value;
    });
    filteredTransactions.forEach(addTransactionToDOM);
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event Listeners
form.addEventListener('submit', e => {
    e.preventDefault();

    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (description.trim() === '' || isNaN(amount) || amount <= 0) {
        alert('Por favor, ingrese datos válidos.');
        return;
    }

    const transaction = { description, amount, type, category };
    transactions.push(transaction);

    if (type === 'income') {
        income += amount;
    } else {
        expenses += amount;
    }

    updateBalance();
    updateCategorySummary();
    updateExpenseChart();
    addTransactionToDOM(transaction);
    saveTransactions();

    // Limpiar el formulario
    form.reset();
});

filterSelect.addEventListener('change', updateTransactionList);

// Inicialización
function init() {
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    updateBalance();
    updateCategorySummary();
    updateExpenseChart();
    updateTransactionList();
}

init();
