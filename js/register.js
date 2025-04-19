document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const showPasswordCheckbox = document.getElementById('showPassword');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Retrieve form values
        const name = document.getElementById('name').value.trim();
        const employeeId = document.getElementById('employeeId').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const role = document.getElementById('role').value;

        // Validate form inputs
        if (!name || !employeeId || !password || !confirmPassword || !role) {
            errorMessage.textContent = 'Please fill in all fields.';
            errorMessage.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            errorMessage.style.display = 'block';
            return;
        }

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the user is already registered
        const existingUser = users.find(user => user.employeeId === employeeId);
        if (existingUser) {
            errorMessage.textContent = 'User is already registered.';
            errorMessage.style.display = 'block';
            return;
        }

        // Register the new user
        const newUser = { name, employeeId, password, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Redirect to login page
        alert('Registration successful! Redirecting to login page...');
        window.location.href = 'login.html';
    });

    // Toggle password visibility
    showPasswordCheckbox.addEventListener('change', function () {
        const type = this.checked ? 'text' : 'password';
        passwordField.type = type;
        confirmPasswordField.type = type;
    });
});
