// Handle Profile Picture Upload
document.getElementById('updateProfilePictureForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const profilePicture = document.getElementById('profilePicture').files[0];

    if (profilePicture) {
        alert(`Profile picture uploaded successfully: ${profilePicture.name}`);
    } else {
        alert('Please select a picture to upload.');
    }
});

// Handle Theme Customization
document.getElementById('lightTheme').addEventListener('click', function () {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    alert('Light theme applied!');
});

document.getElementById('darkTheme').addEventListener('click', function () {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    alert('Dark theme applied!');
});

// Handle Change Password
document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New password and confirmation do not match.');
    } else {
        alert('Password updated successfully!');
    }
});

// Handle Notification Preferences
document.getElementById('notificationPreferencesForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const smsNotifications = document.getElementById('smsNotifications').checked;

    alert(`Notification preferences saved:
    Email Notifications: ${emailNotifications ? 'Enabled' : 'Disabled'}
    SMS Notifications: ${smsNotifications ? 'Enabled' : 'Disabled'}`);
});

// Handle Two-Factor Authentication
document.getElementById('enable2FA').addEventListener('click', function () {
    alert('Two-Factor Authentication enabled!');
});

document.getElementById('disable2FA').addEventListener('click', function () {
    alert('Two-Factor Authentication disabled!');
});

// Handle Language Preferences
document.getElementById('languagePreferencesForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedLanguage = document.getElementById('languageSelect').value;
    alert(`Language preference saved: ${selectedLanguage}`);
});