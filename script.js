var transactions = [];

var storedData = localStorage.getItem('transactions');
if (storedData) {
    transactions = JSON.parse(storedData);
}

function resetFormFields() {
    document.getElementById('description').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('edit-id').value = "";
    document.getElementById('add-btn').textContent = "Add Transaction";
    console.log("Form has been reset");
}

function updateSummary() {
    var income = 0;
    var expense = 0;

    for (var i = 0; i < transactions.length; i++) {
        var amt = parseFloat(transactions[i].amount);
        if (amt > 0) { income += amt; }
        else { expense += amt; }
    }

    document.getElementById('total-income').textContent = income.toFixed(2);
    document.getElementById('total-expense').textContent = Math.abs(expense).toFixed(2);
    document.getElementById('net-balance').textContent = (income + expense).toFixed(2);
}

function render() {
    var list = document.getElementById('transaction-list');
    list.innerHTML = "";

    var filter = "all";
    var radios = document.getElementsByName('filter');
    for (var r = 0; r < radios.length; r++) {
        if (radios[r].checked) { filter = radios[r].value; }
    }

    for (var i = 0; i < transactions.length; i++) {
        var t = transactions[i];
        var amt = parseFloat(t.amount);

        if (filter === "income" && amt <= 0) continue;
        if (filter === "expense" && amt >= 0) continue;

        var li = document.createElement('li');
        li.className = "transaction-item";
        li.innerHTML =
            '<span><strong>' + t.description + '</strong>: ' + t.amount + '</span>' +
            '<div class="actions-group">' +
            '<button class="edit-btn" onclick="editItem(' + t.id + ')">Edit</button>' +
            '<button class="delete-btn" onclick="deleteItem(' + t.id + ')">Delete</button>' +
            '</div>';
        list.appendChild(li);
    }
    updateSummary();
}

document.getElementById('transaction-form').onsubmit = function (e) {
    e.preventDefault();

    var desc = document.getElementById('description').value;
    var amt = document.getElementById('amount').value;
    var editId = document.getElementById('edit-id').value;

    if (editId) {
        for (var i = 0; i < transactions.length; i++) {
            if (transactions[i].id.toString() === editId) {
                transactions[i].description = desc;
                transactions[i].amount = amt;
            }
        }
    } else {
        var newTransaction = {
            id: Date.now(),
            description: desc,
            amount: amt
        };
        transactions.push(newTransaction);
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    resetFormFields();
    render();
};

function deleteItem(id) {
    var filtered = [];
    for (var i = 0; i < transactions.length; i++) {
        if (transactions[i].id !== id) {
            filtered.push(transactions[i]);
        }
    }
    transactions = filtered;
    localStorage.setItem('transactions', JSON.stringify(transactions));
    render();
}

function editItem(id) {
    for (var i = 0; i < transactions.length; i++) {
        if (transactions[i].id === id) {
            document.getElementById('description').value = transactions[i].description;
            document.getElementById('amount').value = transactions[i].amount;
            document.getElementById('edit-id').value = transactions[i].id;
            document.getElementById('add-btn').textContent = "Update Transaction";
        }
    }
}

render();