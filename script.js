const allEmail = [];

const createUser = () => {
    const inputEmail = document.getElementById('email');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const sex = document.getElementById('sex');
    const location = document.getElementById('location');
    
    if (!inputEmail || !firstName || !lastName || !sex || !location) return;
    
    const emailVal = inputEmail.value.trim();
    const firstVal = firstName.value.trim();
    const lastVal = lastName.value.trim();
    const sexVal = sex.value;
    const locVal = location.value.trim();
    
    if (emailVal && firstVal && lastVal && sexVal && locVal) {
         toast('Account created successfully!', '#000', '#0f0');
         
         // clear inputs
         inputEmail.value = '';
         firstName.value = '';
         lastName.value = '';
         sex.value = '';
         location.value = '';
         
         allEmail.push(emailVal);
         setTimeout(()=>{
           window.location.href = 'signin.html';
         }, 1000);
    } else {
         toast('Please fill in all required fields!', '#fff', '#f00');
    }
};

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
    toast('Signing up with Google...', '#000', '#fff');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
};

const appleAuth = () => {
    toast('Signing up with Apple...', '#fff', '#000');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
};
