const allUsers = JSON.parse(localStorage.getItem('users')) || [];

window.addEventListener('load', function() {
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) {
        loader.style.display = 'none';
    }
});

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

const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const signInButton = document.querySelector('.submit-button');

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
        alert('User not found!');
    }
});


function toast(info, color, background) {
    if (typeof Toastify === 'undefined') {
        alert(info);
        return;
    }
    Toastify({
      text: info,
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: background || '#333',
        color: color || '#fff',
      },
      onClick: function(){} // Callback after click
    }).showToast();   
}

const googleAuth = () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'google-user@cowrywise.demo', firstName: 'Google', lastName: 'User' }));
    
    toast('Authenticating with Google...', '#000', '#fff');
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'flex';
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
};

const appleAuth = () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'apple-user@cowrywise.demo', firstName: 'Apple', lastName: 'User' }));
    
    toast('Authenticating with Apple...', '#fff', '#000');
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'flex';
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
};
