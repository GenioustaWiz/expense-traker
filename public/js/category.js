document.addEventListener('DOMContentLoaded', () => {
    // Load categories
    fetch('/categories/list')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(categories => {
            const tableBody = document.querySelector('#categoriesTable tbody');
            tableBody.innerHTML = categories.map(category => `
                <tr>
                    <td>${category.category_id}</td>
                    <td>${category.user_id}</td>
                    <td>${category.category_name}</td>
                    <td>
                        <button data-id="${category.category_id}" data-name="${category.category_name}" class="edit-button">Edit</button>
                        <button data-id="${category.category_id}" class="delete-button">Delete</button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error fetching categories:', error));
    });

    // ===== ADD and EDIT.
    // This part
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('categoryForm');
        const formTitle = document.getElementById('formTitle');
        const submitButton = document.getElementById('submitButton');
        const categoryIdInput = document.getElementById('category_id');
    
        // Function to populate the form for editing
        window.editCategory = (id, name) => {
            if (formTitle && submitButton && categoryIdInput) {
                formTitle.textContent = 'Edit Category';
                submitButton.textContent = 'Update Category';
                console.log("Category id:", id)
                categoryIdInput.value = id;
                console.log("Category :", categoryIdInput)
                
                document.getElementById('category_name').value = name;
            } else {
                console.error('One or more elements not found');
            }
        };
    
        // Example function to handle category edit button clicks
        document.querySelector('#categoriesTable').addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-button')) {
                const categoryId = event.target.dataset.id;
                const categoryName = event.target.dataset.name; // Ensure this data attribute is set in the HTML
                editCategory(categoryId, categoryName);
            } else if (event.target.classList.contains('delete-button')) {
                deleteCategory(event.target.dataset.id);
            }
        });
    });
        

    function deleteCategory(id) {
        if (confirm('Are you sure you want to delete this category?')) {
          fetch(`/categories/delete/${id}`, { method: 'DELETE' })
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