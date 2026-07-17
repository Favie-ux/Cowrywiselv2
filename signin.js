// ===== Firebase imports must be at the TOP of the file =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyBSeaPQfDOL8vE6fkhh3GSFTXahgJzzl-o",
  authDomain: "cowrywise-project.firebaseapp.com",
  projectId: "cowrywise-project",
  storageBucket: "cowrywise-project.firebasestorage.app",
  messagingSenderId: "945150302389",
  appId: "1:945150302389:web:547dd509c92e7ed13306fc",
  measurementId: "G-BX2YCGZHKQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===== Local Storage =====
const allUsers = JSON.parse(localStorage.getItem('users')) || [];

// ===== Hide loading screen on page load =====
window.addEventListener('load', function() {
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) {
        loader.style.display = 'none';
    }
});

// ===== Handle redirect result (for mobile Google sign-in) =====
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      const user = result.user;
      const emailVal = user.email;

      let existingUser = allUsers.find(u => u.email === emailVal);

      if (!existingUser) {
          toast('Account not found! Redirecting to sign up...', '#fff', '#f00');
          const loader = document.getElementById('globalLoadingScreen');
          if (loader) loader.style.display = 'flex';
          setTimeout(() => {
            window.location.href = 'signup.html';
          }, 1500);
          return;
      }

      localStorage.setItem('currentUser', JSON.stringify(existingUser));

      toast('Signed in with Google successfully!', '#000', '#0f0');
      const loader = document.getElementById('globalLoadingScreen');
      if (loader) loader.style.display = 'flex';

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    }
  }).catch((error) => {
    toast(`Error: ${error.message}`, '#fff', '#f00');
  });

// ===== Email Validation =====
window.validateEmail = function(input) {
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

// ===== Password Validation =====
window.validatePassword = function(input) {
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

// ===== Get form elements =====
const emailInput = document.getElementById('signinEmail');
const passwordInput = document.getElementById('signinPassword');
const signInButton = document.getElementById('btn');

// ===== Sign In Button (Email/Password) =====
signInButton.addEventListener('click', (e) => {
    e.preventDefault();

    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value.trim();

    if (!emailVal || !passVal) {
        toast('Please enter both email and password!');
        return;
    }

    if (!validateEmail(emailInput)) {
        toast('Please fix the errors in your email.', '#fff', '#f00');
        return;
    }
    if (!validatePassword(passwordInput)) {
        toast('Please fix the errors in your password.', '#fff', '#f00');
        return;
    }

    const user = allUsers.find(u => u.email === emailVal && u.password === passVal);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));

        toast('Sign in successful!', '#fff', '#0f0');
        const loader = document.getElementById('globalLoadingScreen');
        if (loader) loader.style.display = 'flex';

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        toast('User not found! Check your email and password.', '#fff', '#f00');
    }
});

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
      onClick: function(){}
    }).showToast();
}

// ===== Google Authentication =====
function googleAuth() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
      signInWithRedirect(auth, provider);
  } else {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          const emailVal = user.email;

          let existingUser = allUsers.find(u => u.email === emailVal);

          if (!existingUser) {
              toast('Account not found! Redirecting to sign up...', '#fff', '#f00');
              const loader = document.getElementById('globalLoadingScreen');
              if (loader) loader.style.display = 'flex';
              setTimeout(() => {
                window.location.href = 'signup.html';
              }, 1500);
              return;
          }

          localStorage.setItem('currentUser', JSON.stringify(existingUser));

          toast('Signed in with Google successfully!', '#000', '#0f0');
          const loader = document.getElementById('globalLoadingScreen');
          if (loader) loader.style.display = 'flex';

          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);

        }).catch((error) => {
          if (error.code === 'auth/popup-blocked') {
              signInWithRedirect(auth, provider);
          } else {
              toast(`Error: ${error.message}`, '#fff', '#f00');
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

// ===== Expose functions to global scope =====
window.googleAuth = googleAuth;
window.appleAuth = appleAuth;
