document.addEventListener('DOMContentLoaded', function () {
    // Fetch users from localStorage and ensure each user has a valid ID
    let users = JSON.parse(localStorage.getItem('users')) || [
        {
            name: "John Doe",
            employeeId: "EMP001",
            role: "Admin",
            primaryWeekOff: "Saturday",
            secondaryWeekOff: "Sunday",
            shiftTiming: "9 AM - 6 PM",
            password: "secret123"
        },
        {
            name: "Jane Smith",
            employeeId: "EMP002",
            role: "User",
            primaryWeekOff: "Monday",
            secondaryWeekOff: "Tuesday",
            shiftTiming: "10 AM - 7 PM",
            password: "pass456"
        }
    ];

    // Ensure every user has a unique ID
    users = users.map(user => ({
        ...user,
        id: user.id || Date.now() + Math.floor(Math.random() * 1000) // Assign a unique ID if missing
    }));

    // Save updated users back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Logout Button Functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const confirmLogout = confirm('Are you sure you want to logout?');
            if (confirmLogout) {
                window.location.href = '../login.html'; // Redirect to the login page
            }
        });
    }

    // User Management Table
    const userTable = document.getElementById('userTable');
    const addUserForm = document.getElementById('addUserForm');
    const editUserForm = document.getElementById('editUserForm');
    const editUserAction = document.getElementById('editUserAction');
    const changePasswordFields = document.getElementById('changePasswordFields');
    const changeWeekOffFields = document.getElementById('changeWeekOffFields');
    const changeShiftTimingFields = document.getElementById('changeShiftTimingFields');

    // Punch and Break Buttons
    const punchInBtn = document.getElementById('punchInBtn');
    const punchOutBtn = document.getElementById('punchOutBtn');
    const lunchBreakBtn = document.getElementById('lunchBreakBtn');
    const shortBreakBtn = document.getElementById('shortBreakBtn');
    const restroomBreakBtn = document.getElementById('restroomBreakBtn');
    const punchTimerDisplay = document.getElementById('punchTimerDisplay');
    const breakTimerDisplay = document.getElementById('breakTimerDisplay');
    const currentStatus = document.getElementById('currentStatus');

    // Timers
    let punchTimerSeconds = 0;
    let breakTimerSeconds = 0;
    let punchTimerInterval = null;
    let breakTimerInterval = null;

    // Start Punch Timer
    function startPunchTimer() {
        punchTimerInterval = setInterval(() => {
            punchTimerSeconds++;
            const hrs = String(Math.floor(punchTimerSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((punchTimerSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(punchTimerSeconds % 60).padStart(2, '0');
            punchTimerDisplay.textContent = `Punch Timer: ${hrs}:${mins}:${secs}`;
        }, 1000);
    }

    // Stop Punch Timer
    function stopPunchTimer() {
        clearInterval(punchTimerInterval);
        punchTimerSeconds = 0;
        punchTimerDisplay.textContent = "Punch Timer: 00:00:00";
    }

    // Start Break Timer
    function startBreakTimer() {
        breakTimerInterval = setInterval(() => {
            breakTimerSeconds++;
            const hrs = String(Math.floor(breakTimerSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((breakTimerSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(breakTimerSeconds % 60).padStart(2, '0');
            breakTimerDisplay.textContent = `Break Timer: ${hrs}:${mins}:${secs}`;
        }, 1000);
    }

    // Stop Break Timer
    function stopBreakTimer() {
        clearInterval(breakTimerInterval);
        breakTimerSeconds = 0;
        breakTimerDisplay.textContent = "Break Timer: 00:00:00";
    }

    // Event Listeners for Punch In/Out and Breaks
    if (punchInBtn && punchOutBtn && lunchBreakBtn && shortBreakBtn && restroomBreakBtn) {
        punchInBtn.addEventListener('click', () => {
            stopPunchTimer();
            stopBreakTimer(); // Stop any ongoing break timer
            startPunchTimer();
            currentStatus.textContent = "Status: Punched In";
        });

        punchOutBtn.addEventListener('click', () => {
            stopPunchTimer();
            stopBreakTimer(); // Stop any ongoing break timer
            currentStatus.textContent = "Status: Punched Out";
        });

        lunchBreakBtn.addEventListener('click', () => {
            stopBreakTimer();
            startBreakTimer();
            currentStatus.textContent = "Status: On Lunch Break";
        });

        shortBreakBtn.addEventListener('click', () => {
            stopBreakTimer();
            startBreakTimer();
            currentStatus.textContent = "Status: On Short Break";
        });

        restroomBreakBtn.addEventListener('click', () => {
            stopBreakTimer();
            startBreakTimer();
            currentStatus.textContent = "Status: On Restroom Break";
        });
    }

    // Render Users in the Table
    function renderUsers() {
        if (!userTable) {
            console.error('User Table not found in the DOM.');
            return;
        }

        // Clear the table before rendering new rows
        userTable.innerHTML = '';

        if (users.length === 0) {
            const noUsersRow = document.createElement('tr');
            noUsersRow.innerHTML = `
                <td colspan="8" class="text-center">No registered users found.</td>
            `;
            userTable.appendChild(noUsersRow);
        } else {
            users.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.employeeId}</td>
                    <td>${user.role}</td>
                    <td>${user.primaryWeekOff || 'Not Set'}</td>
                    <td>${user.secondaryWeekOff || 'Not Set'}</td>
                    <td>${user.shiftTiming || 'Not Set'}</td>
                    <td>
                        <button class="btn btn-info btn-sm edit-user-btn" data-id="${user.id}" data-toggle="modal" data-target="#editUserModal">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        }
    }

    // Add User Functionality
    if (addUserForm) {
        addUserForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('addUserName').value.trim();
            const employeeId = document.getElementById('addUserId').value.trim();
            const password = document.getElementById('addUserPassword').value.trim();
            const confirmPassword = document.getElementById('addUserConfirmPassword').value.trim();

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            const newUser = {
                id: Date.now(),
                name,
                employeeId,
                password,
                role: 'employee', // Default role
                primaryWeekOff: '',
                secondaryWeekOff: '',
                shiftTiming: ''
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            $('#addUserModal').modal('hide'); // Close the modal
            addUserForm.reset(); // Reset the form
        });
    } else {
        console.error('Add User Form not found in the DOM.');
    }

    // Edit User Functionality
    userTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-user-btn')) {
            const userId = e.target.getAttribute('data-id');
            console.log('Edit button clicked for ID:', userId); // Debugging log
            console.log('Current users:', users); // Debugging log

            const user = users.find(u => u.id == Number(userId)); // Ensure userId is compared as a number
            if (user) {
                document.getElementById('editUserId').value = user.id;
                document.getElementById('editUserAction').value = ''; // Reset action dropdown
                document.querySelectorAll('.action-fields').forEach(field => field.classList.add('d-none')); // Hide all fields
            } else {
                console.error('User not found when populating the modal');
                alert('The selected user could not be found.');
            }
        }
    });

    // Show/Hide Fields Based on Selected Action
    if (editUserAction) {
        editUserAction.addEventListener('change', function () {
            // Hide all fields initially
            document.querySelectorAll('.action-fields').forEach(field => field.classList.add('d-none'));

            // Show the selected fields
            const selectedAction = editUserAction.value;
            if (selectedAction === 'changePassword') {
                changePasswordFields.classList.remove('d-none');
            } else if (selectedAction === 'changeWeekOff') {
                changeWeekOffFields.classList.remove('d-none');
            } else if (selectedAction === 'changeShiftTiming') {
                changeShiftTimingFields.classList.remove('d-none');
            }
        });
    }

    if (editUserForm) {
        editUserForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const userId = document.getElementById('editUserId').value;
            console.log('User ID:', userId); // Debugging log
            console.log('Users Array:', users); // Debugging log

            const user = users.find(u => u.id === Number(userId)); // Ensure userId is compared as a number
            if (user) {
                const selectedAction = editUserAction.value;

                if (selectedAction === 'changePassword') {
                    const newPassword = document.getElementById('editUserPassword').value;
                    const confirmNewPassword = document.getElementById('editUserConfirmPassword').value;

                    if (newPassword !== confirmNewPassword) {
                        alert('Passwords do not match.');
                        return;
                    }
                    user.password = newPassword;
                } else if (selectedAction === 'changeWeekOff') {
                    user.primaryWeekOff = document.getElementById('editUserPrimaryWeekOff').value;
                    user.secondaryWeekOff = document.getElementById('editUserSecondaryWeekOff').value;
                } else if (selectedAction === 'changeShiftTiming') {
                    user.shiftTiming = document.getElementById('editUserShiftTiming').value;
                }

                localStorage.setItem('users', JSON.stringify(users));
                renderUsers();
                $('#editUserModal').modal('hide'); // Close the modal
            } else {
                console.error('User not found');
                alert('The selected user could not be found.');
            }
        });
    } else {
        console.error('Edit User Form not found in the DOM.');
    }

    // Delete User Functionality
    userTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-user-btn')) {
            const userId = e.target.getAttribute('data-id');
            const confirmDelete = confirm('Are you sure you want to delete this user?');
            if (confirmDelete) {
                users = users.filter(u => u.id != userId);
                localStorage.setItem('users', JSON.stringify(users));
                renderUsers();
            }
        }
    });

    // Initial Render of Users
    renderUsers();
});
