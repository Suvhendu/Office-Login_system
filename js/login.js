document.addEventListener('DOMContentLoaded', function () {
    // Ensure users array exists in localStorage but without predefined users
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([])); // Initialize with an empty array
    }

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const employeeId = document.getElementById('employeeId').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Find the user in the stored users
        const user = users.find(
            u => u.name === username && u.employeeId === employeeId && u.password === password && u.role === role
        );

        if (user) {
            // Save the logged-in user to localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            // Redirect based on role
            if (role === 'admin') {
                window.location.href = 'admin.html'; // Redirect to admin page
            } else if (role === 'employee') {
                window.location.href = 'dashboard.html'; // Redirect to employee dashboard
            }
        } else {
            alert('Invalid credentials or role. Please try again.');
        }
    });

    document.getElementById('role').addEventListener('change', function () {
        const isAdminInput = document.getElementById('isAdmin');
        isAdminInput.value = this.value === 'admin';
    });

    // Show/Hide Password Functionality
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPassword');

    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', function () {
            if (this.checked) {
                passwordInput.type = 'text'; // Show password
            } else {
                passwordInput.type = 'password'; // Hide password
            }
        });
    }
});
