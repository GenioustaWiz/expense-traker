document.addEventListener('DOMContentLoaded', () => {
    const Buform = document.getElementById('budgetForm');
    const BuformTitle = document.getElementById('budget-formTitle');
    const BusubmitButton = document.getElementById('bu-submitButton');
    const budgetIdInput = document.getElementById('budget_id');
    const BucategorySelect = document.getElementById('Bu_category_id');
    const budgetsTable = document.getElementById('budgetsTable');

    // Load budgets
    if (budgetsTable) {
        fetch('/budgets/list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(budgets => {
                const tableBody = budgetsTable.querySelector('tbody');
                if (tableBody) {
                    tableBody.innerHTML = budgets.map(budget => `
                        <tr>
                            <td>${budget.budget_id}</td>
                            <td>${budget.Category.category_name}</td>
                            <td>${budget.amount}</td>
                            <td>${budget.start_date}</td>
                            <td>${budget.end_date}</td>
                            <td>
                                <button data-id="${budget.budget_id}" data-category-id="${budget.category_id}" data-amount="${budget.amount}" data-start-date="${budget.start_date}" data-end-date="${budget.end_date}" class="edit-button">Edit</button>
                                <button data-id="${budget.budget_id}" class="delete-button">Delete</button>
                            </td>
                        </tr>
                    `).join('');
                }
            })
            .catch(error => console.error('Error fetching budgets:', error));
    }

    // Fetch categories and populate the dropdown
    if (BucategorySelect) {
        fetch('/budgets/categories')
            .then(response => response.json())
            .then(buCategories => {
                BucategorySelect.innerHTML = buCategories.map(buCategory => `
                    <option value="${buCategory.category_id}">${buCategory.category_name}</option>
                `).join('');
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    // Function to populate the form for editing
    window.editBudget = (id, categoryId, buAmount, startDate, endDate) => {
        if (BuformTitle && BusubmitButton && budgetIdInput && BucategorySelect) {
            BuformTitle.textContent = 'Edit Budget';
            BusubmitButton.textContent = 'Update Budget';
            budgetIdInput.value = id;
            BucategorySelect.value = categoryId;
            document.getElementById('Bu_amount').value = buAmount;
            document.getElementById('St_date').value = startDate;
            document.getElementById('End_date').value = endDate;
        } else {
            console.error('One or more elements not found');
        }
    };

    // Event listener for edit and delete buttons
    if (budgetsTable) {
        budgetsTable.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-button')) {
                const { id, categoryId, amount, startDate, endDate } = event.target.dataset;
                editBudget(id, categoryId, amount, startDate, endDate);
            } else if (event.target.classList.contains('delete-button')) {
                deleteBudget(event.target.dataset.id);
            }
        });
    }
});

function deleteBudget(id) {
    if (confirm('Are you sure you want to delete this budget?')) {
        fetch(`/budgets/delete/${id}`, { method: 'DELETE' })
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