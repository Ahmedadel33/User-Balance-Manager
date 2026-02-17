// Get DOM elements
const userForm = document.getElementById('userForm');
const userNameInput = document.getElementById('userName');
const userBalanceInput = document.getElementById('userBalance');
const tableBody = document.getElementById('tableBody');
const emptyMessage = document.getElementById('emptyMessage');

// Initialize users array from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Display users on page load
displayUsers();

// Form submit event
userForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addUser();
});

// Add new user
function addUser() {
    const name = userNameInput.value.trim();
    const balance = parseFloat(userBalanceInput.value);

    // Validate inputs
    if (name === '' || isNaN(balance)) {
        alert('❌ Please fill all fields correctly!');
        return;
    }

    // Generate unique ID
    const id = Date.now();

    // Create user object
    const user = {
        id: id,
        name: name,
        balance: balance
    };

    // Add to users array
    users.push(user);

    // Save to localStorage
    saveToLocalStorage();

    // Display updated users
    displayUsers();

    // Clear form
    userForm.reset();
    userNameInput.focus();

    // Success message
    showSuccessMessage('✅ User added successfully!');
}

// Display all users in table
function displayUsers() {
    tableBody.innerHTML = '';

    if (users.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    }

    emptyMessage.classList.add('hidden');

    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>$${user.balance.toFixed(2)}</td>
            <td>
                <button class="btn btn-edit" onclick="editUser(${user.id})">
                    ✏️ Edit
                </button>
                <button class="btn btn-delete" onclick="deleteUser(${user.id})">
                    🗑️ Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Edit user balance
function editUser(id) {
    const user = users.find(u => u.id === id);
    
    if (!user) return;

    const newBalance = prompt(`Edit balance for ${user.name}:`, user.balance);

    if (newBalance === null) return; // User cancelled

    const parsedBalance = parseFloat(newBalance);

    if (isNaN(parsedBalance)) {
        alert('❌ Please enter a valid number!');
        return;
    }

    // Update balance
    user.balance = parsedBalance;

    // Save to localStorage
    saveToLocalStorage();

    // Display updated users
    displayUsers();

    // Success message
    showSuccessMessage('✅ Balance updated successfully!');
}

// Delete user
function deleteUser(id) {
    const user = users.find(u => u.id === id);
    
    if (!user) return;

    const confirmed = confirm(`Are you sure you want to delete ${user.name}?`);

    if (!confirmed) return;

    // Remove user from array
    users = users.filter(u => u.id !== id);

    // Save to localStorage
    saveToLocalStorage();

    // Display updated users
    displayUsers();

    // Success message
    showSuccessMessage('✅ User deleted successfully!');
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Show success message
function showSuccessMessage(message) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(messageDiv);

    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);