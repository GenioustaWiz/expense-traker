document.addEventListener('DOMContentLoaded', () => {
    const Exform = document.getElementById('expenseForm');
    const ExformTitle = document.getElementById('expense-formTitle');
    const ExsubmitButton = document.getElementById('ex-submitButton');
    const expenseIdInput = document.getElementById('expense_id');
    const ExcategorySelect = document.getElementById('Ex_category_id');
    const expensesTable = document.getElementById('expensesTable');

    // Load expenses
    if (expensesTable) {
        fetch('/expenses/list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(expenses => {
                const tableBody = expensesTable.querySelector('tbody');
                if (tableBody) {
                    tableBody.innerHTML = expenses.map(expense => `
                        <tr>
                            <td>${expense.expense_id}</td>
                            <td>${expense.Category.category_name}</td>
                            <td>${expense.amount}</td>
                            <td>${expense.date}</td>
                            <td>${expense.description}</td>
                            <td>
                                <button data-id="${expense.expense_id}" data-category-id="${expense.category_id}" data-amount="${expense.amount}" data-date="${expense.date}" data-description="${expense.description}" class="edit-button">Edit</button>
                                <button data-id="${expense.expense_id}" class="delete-button">Delete</button>
                            </td>
                        </tr>
                    `).join('');
                }
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }

    // Fetch categories and populate the dropdown
    if (ExcategorySelect) {
        fetch('/expenses/categories')
            .then(response => response.json())
            .then(exCategories => {
                ExcategorySelect.innerHTML = exCategories.map(exCategory => `
                    <option value="${exCategory.category_id}">${exCategory.category_name}</option>
                `).join('');
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    // Function to populate the form for editing
    window.editExpense = (id, categoryId, exAmount, exDate, exDescription) => {
        if (ExformTitle && ExsubmitButton && expenseIdInput && ExcategorySelect) {
            ExformTitle.textContent = 'Edit Expense';
            ExsubmitButton.textContent = 'Update Expense';
            expenseIdInput.value = id;
            ExcategorySelect.value = categoryId;
            document.getElementById('Ex_amount').value = exAmount;
            document.getElementById('Ex_date').value = exDate;
            document.getElementById('Ex_description').value = exDescription;
        } else {
            console.error('One or more elements not found');
        }
    };

    // Event listener for edit and delete buttons
    if (expensesTable) {
        expensesTable.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-button')) {
                const { id, categoryId, amount, date, description } = event.target.dataset;
                editExpense(id, categoryId, amount, date, description);
            } else if (event.target.classList.contains('delete-button')) {
                deleteExpense(event.target.dataset.id);
            }
        });
    }
});

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        fetch(`/expenses/delete/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                // Redirect to a relative path
                window.location.href = "/";
            })
            .catch(error => {
                console.error('Error:', error);
                // Here you can show an error message to the user
            });
    }
}