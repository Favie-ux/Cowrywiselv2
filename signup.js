const allUsers = JSON.parse(localStorage.getItem("users")) || [];

window.addEventListener('load', function() {
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) {
        loader.style.display = 'none';
    }
});

window.handleHalalToggle = function(checkbox) {
    if (checkbox.checked) {
        document.getElementById('halalModalOverlay').style.display = 'flex';
    }
};

window.closeHalalModal = function() {
    document.getElementById('halalModalOverlay').style.display = 'none';
};

window.validateEmail = function(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const errorEl = document.getElementById('emailError');
    if (input.value.trim() === '') {
        input.style.border = '';
        if (errorEl) errorEl.style.display = 'none';
        return false;
    }
    if (emailRegex.test(input.value.trim())) {
        input.style.border = '1px solid #28a745'; // Bootstrap success green
        if (errorEl) errorEl.style.display = 'none';
        return true;
    } else {
        input.style.border = '1px solid #dc3545'; // Bootstrap error red
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

const createUser = () => {
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
         if(halalToggle) halalToggle.checked = false;

         const loader = document.getElementById('globalLoadingScreen');
         if (loader) loader.style.display = 'flex';
         
         setTimeout(()=>{
           window.location.href = 'signin.html';
         }, 1000);
     }
     else {
         toast('Please fill in all required fields!', '#fff', '#f00');
     }
}

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

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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

getRedirectResult(auth)
  .then((result) => {
    if (result) {
      const user = result.user;
      
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
  }).catch((error) => {
    const errorMessage = error.message;
    toast(`Error: ${errorMessage}`, '#fff', '#f00');
  });

function googleAuth() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
      signInWithRedirect(auth, provider);
  } else {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          
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

        }).catch((error) => {
          if (error.code === 'auth/popup-blocked') {
              signInWithRedirect(auth, provider);
          } else {
              const errorMessage = error.message;
              toast(`Error: ${errorMessage}`, '#fff', '#f00');
          }
        });
  }
}

function appleAuth() {
  localStorage.setItem('currentUser', JSON.stringify({ email: 'apple-user@cowrywise.demo', firstName: 'Apple', lastName: 'User' }));

  toast('Authenticating with Apple...', '#fff', '#000');
  const loader = document.getElementById('globalLoadingScreen');
  if (loader) loader.style.display = 'flex';
  
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
}

window.googleAuth = googleAuth;
window.appleAuth = appleAuth;
window.createUser = createUser;