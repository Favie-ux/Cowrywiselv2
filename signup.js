// ===== Local Storage =====
const allUsers = JSON.parse(localStorage.getItem("users")) || [];

// ===== Firebase Compat Config =====
const firebaseConfig = {
    apiKey: "AIzaSyBSeaPQfDOL8vE6fkhh3GSFTXahgJzzl-o",
    authDomain: "cowrywise-project.firebaseapp.com",
    projectId: "cowrywise-project",
    storageBucket: "cowrywise-project.firebasestorage.app",
    messagingSenderId: "945150302389",
    appId: "1:945150302389:web:547dd509c92e7ed13306fc",
    measurementId: "G-BX2YCGZHKQ"
};

const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// ===== Hide loading screen on page load =====
window.addEventListener('load', function () {
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'none';

    // Handle redirect result (for mobile)
    auth.getRedirectResult().then(function (result) {
        if (result && result.user) {
            handleGoogleUser(result.user);
        }
    }).catch(function (error) {
        toast('Error: ' + error.message, '#fff', '#f00');
    });
});

// ===== Halal Modal =====
function handleHalalToggle(checkbox) {
    if (checkbox.checked) {
        document.getElementById('halalModalOverlay').style.display = 'flex';
    }
}

function closeHalalModal() {
    document.getElementById('halalModalOverlay').style.display = 'none';
}

// ===== Email Validation =====
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const errorEl = document.getElementById('emailError');
    if (input.value.trim() === '') {
        input.style.border = '';
        if (errorEl) errorEl.style.display = 'none';
        return false;
    }
    if (emailRegex.test(input.value.trim())) {
        input.style.border = '1px solid #28a745';
        if (errorEl) errorEl.style.display = 'none';
        return true;
    } else {
        input.style.border = '1px solid #dc3545';
        if (errorEl) errorEl.style.display = 'block';
        return false;
    }
}

// ===== Password Validation =====
function validatePassword(input) {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const errorEl = document.getElementById('passwordError');
    if (input.value === '') {
        input.style.border = '';
        if (errorEl) errorEl.style.display = 'none';
        return false;
    }
    if (passRegex.test(input.value)) {
        input.style.border = '1px solid #28a745';
        if (errorEl) errorEl.style.display = 'none';
        return true;
    } else {
        input.style.border = '1px solid #dc3545';
        if (errorEl) errorEl.style.display = 'block';
        return false;
    }
}

// ===== Create User (Email/Password Sign Up) =====
function createUser() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const inputEmail = document.getElementById('email');
    const sex = document.getElementById('sex');
    const password = document.getElementById('password');
    const location = document.getElementById('location');
    const halalToggle = document.getElementById('halalToggle');

    if (!inputEmail || !firstName || !lastName || !password || !sex || !location) return;

    const firstVal = firstName.value.trim();
    const lastVal = lastName.value.trim();
    const emailVal = inputEmail.value.trim();
    const sexVal = sex.value;
    const passVal = password.value.trim();
    const locVal = location.value.trim();
    const isHalal = halalToggle ? halalToggle.checked : false;

    if (emailVal && firstVal && lastVal && passVal && sexVal && locVal) {
        if (!validateEmail(inputEmail)) {
            toast('Please fix the errors in your email.', '#fff', '#f00');
            return;
        }
        if (!validatePassword(password)) {
            toast('Please fix the errors in your password.', '#fff', '#f00');
            return;
        }
        if (allUsers.some(user => user.email === emailVal)) {
            toast('Email already exists!', '#fff', '#f00');
            return;
        }

        toast('Account created successfully!', '#000', '#0f0');

        const newUser = {
            email: emailVal,
            firstName: firstVal,
            lastName: lastVal,
            sex: sexVal,
            location: locVal,
            password: passVal,
            isHalal: isHalal
        };
        allUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(allUsers));

        inputEmail.value = '';
        firstName.value = '';
        lastName.value = '';
        sex.value = '';
        location.value = '';
        password.value = '';
        if (halalToggle) halalToggle.checked = false;

        const loader = document.getElementById('globalLoadingScreen');
        if (loader) loader.style.display = 'flex';

        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 1000);
    } else {
        toast('Please fill in all required fields!', '#fff', '#f00');
    }
}

// ===== Toast Notification =====
function toast(info, color, background) {
    if (typeof Toastify === 'undefined') {
        alert(info);
        return;
    }
    Toastify({
        text: info,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: background || '#333',
            color: color || '#fff',
        },
        onClick: function () {}
    }).showToast();
}

// ===== Handle Google User Data =====
function handleGoogleUser(user) {
    const nameParts = user.displayName ? user.displayName.split(' ') : ['Google', 'User'];
    const emailVal = user.email;
    const firstVal = nameParts[0];
    const lastVal = nameParts.slice(1).join(' ') || 'User';

    let existingUser = allUsers.find(u => u.email === emailVal);

    if (!existingUser) {
        existingUser = {
            email: emailVal,
            firstName: firstVal,
            lastName: lastVal,
            sex: '',
            location: '',
            password: '',
            isHalal: false
        };
        allUsers.push(existingUser);
        localStorage.setItem("users", JSON.stringify(allUsers));
    }

    localStorage.setItem('currentUser', JSON.stringify(existingUser));

    toast('Signed in with Google successfully!', '#000', '#0f0');
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'flex';

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// ===== Google Authentication =====
function googleAuth() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        auth.signInWithRedirect(provider);
    } else {
        auth.signInWithPopup(provider)
            .then(function (result) {
                handleGoogleUser(result.user);
            })
            .catch(function (error) {
                if (error.code === 'auth/popup-blocked') {
                    auth.signInWithRedirect(provider);
                } else {
                    toast('Error: ' + error.message, '#fff', '#f00');
                }
            });
    }
}

// ===== Apple Authentication =====
function appleAuth() {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'apple-user@cowrywise.demo', firstName: 'Apple', lastName: 'User' }));
    toast('Authenticating with Apple...', '#fff', '#000');
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'flex';
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}