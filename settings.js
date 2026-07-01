if (!localStorage.getItem('currentUser')) {
    window.location.replace('signin.html');
}

window.addEventListener('load', function() {
    var loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'none';

    var darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'on') {
        document.body.classList.add('dark');
        document.getElementById('darkModeToggle').checked = true;
    }
});

function toggleDarkMode(checkbox) {
    if (checkbox.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', 'on');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('darkMode', 'off');
    }
}

function changePin() {
    var newPin = document.getElementById('newPin').value.trim();
    var confirmPin = document.getElementById('confirmPin').value.trim();

    if (newPin.length !== 4 || isNaN(newPin)) {
        showToast('PIN must be exactly 4 digits.');
        return;
    }

    if (newPin !== confirmPin) {
        showToast('PINs do not match. Try again.');
        document.getElementById('newPin').value = '';
        document.getElementById('confirmPin').value = '';
        return;
    }

    var user = JSON.parse(localStorage.getItem('currentUser'));
    var allUsers = JSON.parse(localStorage.getItem('users')) || [];

    user.pin = newPin;
    localStorage.setItem('currentUser', JSON.stringify(user));

    for (var i = 0; i < allUsers.length; i++) {
        if (allUsers[i].email === user.email) {
            allUsers[i].pin = newPin;
        }
    }
    localStorage.setItem('users', JSON.stringify(allUsers));

    document.getElementById('newPin').value = '';
    document.getElementById('confirmPin').value = '';
    showToast('PIN updated successfully!');
}

function changePassword() {
    var passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    var currentPass = document.getElementById('currentPassword').value.trim();
    var newPass = document.getElementById('newPassword').value.trim();
    var confirmPass = document.getElementById('confirmPassword').value.trim();

    var user = JSON.parse(localStorage.getItem('currentUser'));
    var allUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (currentPass !== user.password) {
        showToast('Current password is incorrect.');
        return;
    }

    if (!passRegex.test(newPass)) {
        showToast('New password must be 8+ chars with uppercase, lowercase, number & special character.');
        return;
    }

    if (newPass !== confirmPass) {
        showToast('New passwords do not match.');
        return;
    }

    user.password = newPass;
    localStorage.setItem('currentUser', JSON.stringify(user));

    for (var i = 0; i < allUsers.length; i++) {
        if (allUsers[i].email === user.email) {
            allUsers[i].password = newPass;
        }
    }
    localStorage.setItem('users', JSON.stringify(allUsers));

    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showToast('Password updated successfully!');
}

function showToast(msg) {
    var toast = document.getElementById('toastMsg');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(function() {
        toast.style.display = 'none';
    }, 3000);
}
