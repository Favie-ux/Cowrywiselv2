const allUsers = JSON.parse(localStorage.getItem('users')) || [];

// ── Firebase Compat ──────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyBSeaPQfDOL8vE6fkhh3GSFTXahgJzzl-o",
    authDomain: "cowrywise-project.firebaseapp.com",
    projectId: "cowrywise-project",
    storageBucket: "cowrywise-project.firebasestorage.app",
    messagingSenderId: "945150302389",
    appId: "1:945150302389:web:547dd509c92e7ed13306fc",
    measurementId: "G-BX2YCGZHKQ"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// ── Hide loader on page load, handle mobile redirect ────────────
window.addEventListener('load', function () {
    var loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'none';

    // Catches the result after signInWithRedirect (mobile)
    auth.getRedirectResult().then(function (result) {
        if (result && result.user) handleGoogleSignIn(result.user);
    }).catch(function (error) {
        toast('Error: ' + error.message, '#fff', '#f00');
    });
});

// ── Email Validation ────────────────────────────────────────────
window.validateEmail = function (input) {
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
};

// ── Password Validation ──────────────────────────────────────────
window.validatePassword = function (input) {
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
};

// ── Get form elements ────────────────────────────────────────────
const emailInput    = document.getElementById('signinEmail');
const passwordInput = document.getElementById('signinPassword');
const signInButton  = document.getElementById('btn');

// ── Email/Password Sign In ───────────────────────────────────────
signInButton.addEventListener('click', function (e) {
    e.preventDefault();

    const emailVal = emailInput.value.trim();
    const passVal  = passwordInput.value.trim();

    if (!emailVal || !passVal) { toast('Please enter both email and password!'); return; }
    if (!validateEmail(emailInput))    { toast('Please fix your email.', '#fff', '#f00'); return; }
    if (!validatePassword(passwordInput)) { toast('Please fix your password.', '#fff', '#f00'); return; }

    const user = allUsers.find(u => u.email === emailVal && u.password === passVal);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast('Sign in successful!', '#fff', '#0f0');
        const loader = document.getElementById('globalLoadingScreen');
        if (loader) loader.style.display = 'flex';
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    } else {
        toast('User not found! Check your email and password.', '#fff', '#f00');
    }
});

// ── Toast ────────────────────────────────────────────────────────
function toast(info, color, background) {
    if (typeof Toastify === 'undefined') { alert(info); return; }
    Toastify({
        text: info, duration: 3000, close: true,
        gravity: "top", position: "center", stopOnFocus: true,
        style: { background: background || '#333', color: color || '#fff' },
        onClick: function () {}
    }).showToast();
}

// ── Handle Google Sign In ─────────────────────────────────────────
// If user has no account → redirect to sign up (Google auth on signup page
// will create their profile automatically)
function handleGoogleSignIn(user) {
    const emailVal = user.email;

    // Re-read allUsers fresh in case the page reloaded (redirect flow)
    const latestUsers  = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = latestUsers.find(u => u.email === emailVal);

    if (!existingUser) {
        // No account found → send them to sign up
        toast('No account found! Redirecting you to Sign Up...', '#fff', '#f00');
        const loader = document.getElementById('globalLoadingScreen');
        if (loader) loader.style.display = 'flex';
        setTimeout(() => { window.location.href = 'signup.html'; }, 1800);
        return;
    }

    // Account found → sign them in
    localStorage.setItem('currentUser', JSON.stringify(existingUser));
    toast('Signed in with Google successfully!', '#000', '#0f0');
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'flex';
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
}

// ── Google Auth ──────────────────────────────────────────────────
function googleAuth() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        auth.signInWithRedirect(provider);
    } else {
        auth.signInWithPopup(provider)
            .then(function (result) { handleGoogleSignIn(result.user); })
            .catch(function (error) {
                if (error.code === 'auth/popup-blocked') {
                    auth.signInWithRedirect(provider);
                } else {
                    toast('Error: ' + error.message, '#fff', '#f00');
                }
            });
    }
}

// ── Apple Auth ───────────────────────────────────────────────────
function appleAuth() {
    localStorage.setItem('currentUser', JSON.stringify({
        email: 'apple-user@cowrywise.demo',
        firstName: 'Apple', lastName: 'User',
        profilePhoto: '', authProvider: 'apple'
    }));
    toast('Authenticating with Apple...', '#fff', '#000');
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'flex';
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
}

window.googleAuth = googleAuth;
window.appleAuth  = appleAuth;
