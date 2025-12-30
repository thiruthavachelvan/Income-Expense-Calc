let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction() {
    const desc = document.getElementById('description').value;
    let amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value; 
    const editId = document.getElementById('edit-id').value;

    if (desc === "" || isNaN(amount)) {
        alert("Enter a valid item and amount!");
        return;
    }

    // Logic for Income vs Expense choice
    amount = (type === 'expense') ? -Math.abs(amount) : Math.abs(amount);

    if (editId) {
        transactions = transactions.map(t => t.id == editId ? { ...t, description: desc, amount: amount } : t);
    } else {
        transactions.push({ id: Date.now(), description: desc, amount: amount });
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    resetFormFields();
    render();
}

function deleteItem(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    render();
}

function editItem(id) {
    const t = transactions.find(t => t.id === id);
    document.getElementById('description').value = t.description;
    document.getElementById('amount').value = Math.abs(t.amount);
    document.getElementById('type').value = t.amount >= 0 ? 'income' : 'expense';
    document.getElementById('edit-id').value = t.id;
    document.getElementById('add-btn').textContent = "Update";
}

function resetFormFields() {
    document.getElementById('description').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('edit-id').value = "";
    document.getElementById('add-btn').textContent = "Add Transaction";
}

function render() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = "";
    let inc = 0, exp = 0;

    transactions.forEach(t => {
        if (t.amount > 0) inc += t.amount;
        else exp += Math.abs(t.amount);

        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.style.borderLeft = `5px solid ${t.amount > 0 ? '#00f2fe' : '#f953c6'}`;
        li.innerHTML = `
            <span><strong>${t.description}</strong>: ${t.amount.toFixed(2)}</span>
            <div class="actions-group">
                <button class="edit-btn" onclick="editItem(${t.id})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${t.id})">Del</button>
            </div>
        `;
        list.appendChild(li);
    });

    document.getElementById('total-income').textContent = inc.toFixed(2);
    document.getElementById('total-expense').textContent = exp.toFixed(2);
    document.getElementById('net-balance').textContent = (inc - exp).toFixed(2);
}

render();