// 1. Load and normalize transactions from LocalStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
transactions = transactions.map(t => ({ ...t, amount: Number(t.amount) }));

function addTransaction() {
    const desc = document.getElementById('description').value;
    let amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value; 
    const editId = document.getElementById('edit-id').value;

    if (desc === "" || isNaN(amount)) {
        alert("Enter a valid item and amount!");
        return;
    }

    // Ensure expenses are negative, income is positive
    amount = (type === 'expense') ? -Math.abs(amount) : Math.abs(amount);

    if (editId) {
        transactions = transactions.map(t => t.id == editId ? { ...t, description: desc, amount: amount } : t);
    } else {
        transactions.push({ id: Date.now(), description: desc, amount: amount });
    }

    updateStorage();
    resetFormFields();
    render();
}

function deleteItem(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateStorage();
    render();
}

function editItem(id) {
    const t = transactions.find(t => t.id === id);
    const amt = Number(t.amount) || 0;
    document.getElementById('description').value = t.description;
    document.getElementById('amount').value = Math.abs(amt);
    document.getElementById('type').value = amt >= 0 ? 'income' : 'expense';
    document.getElementById('edit-id').value = t.id;
    document.getElementById('add-btn').textContent = "Update";
}

function updateStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function resetFormFields() {
    document.getElementById('description').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('edit-id').value = "";
    document.getElementById('add-btn').textContent = "Add Transaction";
}

// --- THIS IS THE KEY FUNCTION THAT FIXES YOUR BUG ---
function render() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = "";

    // 1. Get currently selected filter
    const filterRadio = document.querySelector('input[name="filter"]:checked');
    const filterValue = filterRadio ? filterRadio.value : 'all';

    let inc = 0, exp = 0;

    // 2. Calculate Totals (Always use ALL data for summary boxes, regardless of filter)
    transactions.forEach(t => {
        const amt = Number(t.amount) || 0;
        if (amt > 0) inc += amt;
        else exp += Math.abs(amt);
    });

    // 3. Filter the visual list based on radio selection
    const filteredTransactions = transactions.filter(t => {
        if (filterValue === 'all') return true;
        if (filterValue === 'income') return t.amount > 0;  // Only positive
        if (filterValue === 'expense') return t.amount < 0; // Only negative
    });

    // 4. Render only the filtered items
    filteredTransactions.forEach(t => {
        const amt = Number(t.amount) || 0;
        const li = document.createElement('li');
        li.className = 'transaction-item';
        // Color border based on type
        li.style.borderLeft = `5px solid ${amt > 0 ? '#00f2fe' : '#f953c6'}`;
        li.innerHTML = `
            <span><strong>${t.description}</strong>: ${amt.toFixed(2)}</span>
            <div class="actions-group">
                <button class="edit-btn" onclick="editItem(${t.id})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${t.id})">Del</button>
            </div>
        `;
        list.appendChild(li);
    });

    // Update Summary Values
    document.getElementById('total-income').textContent = inc.toFixed(2);
    document.getElementById('total-expense').textContent = exp.toFixed(2);
    document.getElementById('net-balance').textContent = (inc - exp).toFixed(2);
}

// Initial Render
render();