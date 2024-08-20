document.addEventListener('DOMContentLoaded', () => {
    const Pmform = document.getElementById('payment_methodForm');
    const PmformTitle = document.getElementById('payment_method-formTitle');
    const PmsubmitButton = document.getElementById('pm-submitButton');
    const payment_methodIdInput = document.getElementById('payment_method_id');
    const PmcategorySelect = document.getElementById('Pm_category_id');
    const payment_methodsTable = document.getElementById('payment_methodsTable');

    // Load payment_methods
    if (payment_methodsTable) {
        fetch('/payMethods/list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(payment_methods => {
                const tableBody = payment_methodsTable.querySelector('tbody');
                if (tableBody) {
                    tableBody.innerHTML = payment_methods.map(payment_method => `
                        <tr>
                            <td>${payment_method.payment_method_id}</td>
                            <td>${payment_method.payment_method_name}</td>
                            <td>
                                <button data-id="${payment_method.payment_method_id}" data-payment_method_name="${payment_method.payment_method_name}" class="edit-button">Edit</button>
                                <button data-id="${payment_method.payment_method_id}" class="delete-button">Delete</button>
                            </td>
                        </tr>
                    `).join('');
                }
            })
            .catch(error => console.error('Error fetching payment_methods:', error));
    }

    // Function to populate the form for editing
    window.editPayment_m = (id, Pm_name) => {
        if (PmformTitle && PmsubmitButton && payment_methodIdInput) {
            PmformTitle.textContent = 'Edit Payment Method';
            PmsubmitButton.textContent = 'Update Payment Method';
            payment_methodIdInput.value = id;
            document.getElementById('payment_method_name').value = Pm_name;
        } else {
            console.error('One or more elements not found');
        }
    };

    // Event listener for edit and delete buttons
    if (payment_methodsTable) {
        payment_methodsTable.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-button')) {
                const { id, payment_method_name } = event.target.dataset;
                editPayment_m(id, payment_method_name);
            } else if (event.target.classList.contains('delete-button')) {
                deletePayment_m(event.target.dataset.id);
            }
        });
    }
});

function deletePayment_m(id) {
    if (confirm('Are you sure you want to delete this payment method?')) {
        fetch(`/payMethods/delete/${id}`, { method: 'DELETE' })
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