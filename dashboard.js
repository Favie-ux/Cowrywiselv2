let isBalanceVisible = true;

if (!localStorage.getItem('currentUser')) {
    window.location.replace('signin.html');
}

// Apply dark mode globally on every page load
(function applyDarkModeEarly() {
    if (localStorage.getItem('darkMode') === 'on') {
        document.documentElement.classList.add('dark');
        document.body && document.body.classList.add('dark');
    }
})();

window.addEventListener('load', function() {
    const loader = document.getElementById('globalLoadingScreen');
    if (loader) {
        loader.style.display = 'none';
    }
    // Ensure dark mode class is applied after body is fully ready
    if (localStorage.getItem('darkMode') === 'on') {
        document.body.classList.add('dark');
    }
});

function initDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const greetingNameEl = document.getElementById('userGreetingName');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    
    if (currentUser) {
        if (greetingNameEl) greetingNameEl.textContent = currentUser.firstName;
        if (dropdownUserName) dropdownUserName.textContent = currentUser.firstName + " " + (currentUser.lastName || '');
        if (dropdownUserEmail) dropdownUserEmail.textContent = currentUser.email;

        // Load profile photo into the navbar avatar on ALL pages
        if (currentUser.profilePhoto) {
            const avatarEls = document.querySelectorAll('.avatar');
            avatarEls.forEach(function(avatarEl) {
                avatarEl.innerHTML = '<img src="' + currentUser.profilePhoto + '" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
            });
        }
    } else {
        window.location.replace('signin.html');
        return;
    }

    setupPinSecurity(currentUser);

    renderBalance();
    renderNotifications();
}

function setupPinSecurity(user) {
    const overlay = document.getElementById('pinSecurityOverlay');
    
    if (!overlay) return;
    
    if (!user.pin) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

window.moveToNext = function(current, event) {
    if (current.value.length >= current.maxLength) {
        let next = current.nextElementSibling;
        if (next) next.focus();
    }
    if (event.key === 'Backspace' && current.value.length === 0) {
        let prev = current.previousElementSibling;
        if (prev) {
            prev.focus();
            prev.value = '';
        }
    }
};

window.handlePinCreate = function() {
    const createInputs = document.querySelectorAll('#createPinInputs input');
    const confirmInputs = document.querySelectorAll('#confirmPinInputs input');
    
    let createPin = '';
    let confirmPin = '';
    
    for(let i=0; i<createInputs.length; i++) {
        createPin += createInputs[i].value;
    }
    for(let i=0; i<confirmInputs.length; i++) {
        confirmPin += confirmInputs[i].value;
    }
    
    if (createPin.length !== 4 || confirmPin.length !== 4) {
        alert('Please fill in all 4 digits for both fields.');
        return;
    }
    
    if (createPin !== confirmPin) {
        alert('PINs do not match. Please try again.');
        for (let i = 0; i < createInputs.length; i++) {
            createInputs[i].value = '';
            confirmInputs[i].value = '';
        }
        createInputs[0].focus();
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.pin = createPin;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = allUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        allUsers[userIndex].pin = createPin;
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
    
    const overlay = document.getElementById('pinSecurityOverlay');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
};

window.openSettingsModal = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    document.getElementById('setFirstName').value = currentUser.firstName || '';
    document.getElementById('setLastName').value = currentUser.lastName || '';
    document.getElementById('setEmail').value = currentUser.email || '';
    document.getElementById('setSex').value = currentUser.sex || 'female';
    document.getElementById('setLocation').value = currentUser.location || '';
    document.getElementById('setNewPin').value = '';
    
    document.getElementById('settingsModalOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeSettingsModal = function() {
    document.getElementById('settingsModalOverlay').style.display = 'none';
    document.body.style.overflow = '';
};

window.saveSettings = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    const newFirst = document.getElementById('setFirstName').value.trim();
    const newLast = document.getElementById('setLastName').value.trim();
    const newSex = document.getElementById('setSex').value;
    const newLoc = document.getElementById('setLocation').value.trim();
    const newPin = document.getElementById('setNewPin').value.trim();
    
    if (!newFirst || !newLast || !newLoc) {
        alert('First name, Last name, and Location are required.');
        return;
    }
    
    currentUser.firstName = newFirst;
    currentUser.lastName = newLast;
    currentUser.sex = newSex;
    currentUser.location = newLoc;
    
    if (newPin) {
        if (newPin.length !== 4 || isNaN(newPin)) {
            alert('PIN must be a 4-digit number.');
            return;
        }
        currentUser.pin = newPin;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    const userIndex = allUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        allUsers[userIndex].firstName = newFirst;
        allUsers[userIndex].lastName = newLast;
        allUsers[userIndex].sex = newSex;
        allUsers[userIndex].location = newLoc;
        if (newPin) {
            allUsers[userIndex].pin = newPin;
        }
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
    
    const greetingNameEl = document.getElementById('userGreetingName');
    const dropdownUserName = document.getElementById('dropdownUserName');
    if (greetingNameEl) greetingNameEl.textContent = newFirst;
    if (dropdownUserName) dropdownUserName.textContent = newFirst + " " + newLast;
    document.getElementById('userName').textContent = newFirst;
    document.getElementById('profileName').textContent = newFirst + ' ' + newLast;
    
    alert('Settings saved successfully!');
    closeSettingsModal();
};

function toggleBalanceVisibility() {
    const toggleIcon = document.getElementById('toggleBalance');
    const balanceAmount = document.getElementById('balanceAmount');
    
    if (!toggleIcon || !balanceAmount) return;

    isBalanceVisible = !isBalanceVisible;
    
    if (isBalanceVisible) {
        renderBalance();
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        balanceAmount.innerHTML = '••••••';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

function toggleProfileDropdown(event) {
    if (event) event.stopPropagation();
    const profileDropdown = document.getElementById('profileDropdown');
    if (!profileDropdown) return;
    
    const isOpen = profileDropdown.style.display === 'block';
    closeAllDropdowns();
    if (!isOpen) profileDropdown.style.display = 'block';
}

function toggleNotifDropdown(event) {
    if (event) event.stopPropagation();
    const notifDropdown = document.getElementById('notifDropdown');
    if (!notifDropdown) return;
    
    const isOpen = notifDropdown.style.display === 'block';
    closeAllDropdowns();
    if (!isOpen) notifDropdown.style.display = 'block';
}

function closeAllDropdowns() {
    const profileDropdown = document.getElementById('profileDropdown');
    const notifDropdown = document.getElementById('notifDropdown');
    
    if (profileDropdown) profileDropdown.style.display = 'none';
    if (notifDropdown) notifDropdown.style.display = 'none';
}


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (!sidebar) return;
    
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
        closeSidebar();
    } else {
        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scroll behind
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;

window.onclick = function(event) {
    closeAllDropdowns();
};

initDashboard();



function getStoredBalance() {
    return parseFloat(localStorage.getItem('walletBalance') || '0');
}

function saveBalance(amount) {
    localStorage.setItem('walletBalance', String(amount));
}

function renderBalance() {
    const bal = getStoredBalance();
    const balanceMain = document.getElementById('balanceMain');
    const balanceAmount = document.getElementById('balanceAmount');

    if (balanceMain) {
        balanceMain.textContent = bal.toLocaleString('en-NG');
    } else if (balanceAmount) {
        balanceAmount.innerHTML = `₦ ${bal.toLocaleString('en-NG')}<span class="decimals">.00</span>`;
    }
}


const PAYSTACK_PUBLIC_KEY = 'pk_test_4f006c972400f69f3ce830536d93cb16cd3ac0ab';

function openPaymentModal(nairaAmount, currency, foreignAmount) {
    const modal = document.getElementById('paymentModal');
    const input  = document.getElementById('payAmountInput');
    const status = document.getElementById('payStatusMsg');

    if (nairaAmount) {
        input.value = nairaAmount;
    } else {
        input.value = '';
    }

    if (status) {
        status.style.display = 'none';
        status.textContent   = '';
        status.className     = 'pay-status-msg';
    }

    const btn = document.getElementById('payNowBtn');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('paymentModal');
    if (modal && e.target === modal) {
        closePaymentModal();
    }
});

function setModalAmount(amount, event) {
    const input = document.getElementById('payAmountInput');
    if (input) input.value = amount;

    document.querySelectorAll('.pay-quick-pill').forEach(btn => btn.classList.remove('active'));
    // Use the passed event if available, otherwise try global event
    var clickedBtn = (event && event.target) ? event.target : null;
    if (clickedBtn) clickedBtn.classList.add('active');
}


function initiatePaystackPayment() {
    const input  = document.getElementById('payAmountInput');
    const status = document.getElementById('payStatusMsg');
    const btn    = document.getElementById('payNowBtn');

    const amount = parseFloat(input.value);

    if (!amount || amount < 100) {
        showPayStatus('⚠️ Please enter an amount of at least ₦100.', 'warn');
        return;
    }

    // Always use the currently logged-in user's email for Paystack
    const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = (currentUserData && currentUserData.email)
        ? currentUserData.email
        : 'customer@cowrywise.demo';

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening payment...';

    if (typeof PaystackPop === 'undefined') {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
        showPayStatus('⚠️ Paystack failed to load. Check your internet connection and refresh the page.', 'error');
        return;
    }

    // Shared config for both API versions
    const paystackConfig = {
        key:      PAYSTACK_PUBLIC_KEY,
        email:    email,
        amount:   Math.round(amount * 100), // kobo
        currency: 'NGN',
        ref:      'CW_' + Date.now() + '_' + Math.floor(Math.random() * 1e6),

        // Callbacks for newer API (newTransaction)
        onSuccess: function(transaction) {
            const newBalance = getStoredBalance() + amount;
            saveBalance(newBalance);
            renderBalance();
            addNotification(`₦${amount.toLocaleString('en-NG')} successfully added to your Naira wallet.`, 'payment');
            showPayStatus(`✅ Payment successful! ₦${amount.toLocaleString('en-NG')} added to your wallet.`, 'success');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Payment Confirmed!';
            setTimeout(() => closePaymentModal(), 2500);
        },
        onCancel: function() {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
            showPayStatus('Payment window closed. Try again when ready.', 'warn');
        },

        // Callbacks for older API (setup/openIframe)
        callback: function(response) {
            const newBalance = getStoredBalance() + amount;
            saveBalance(newBalance);
            renderBalance();
            addNotification(`₦${amount.toLocaleString('en-NG')} successfully added to your Naira wallet.`, 'payment');
            showPayStatus(`✅ Payment successful! ₦${amount.toLocaleString('en-NG')} added to your wallet.`, 'success');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Payment Confirmed!';
            setTimeout(() => closePaymentModal(), 2500);
        },
        onClose: function() {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
            showPayStatus('Payment window closed. Try again when ready.', 'warn');
        }
    };

    // Use the newer newTransaction API if available (better mobile support),
    // otherwise fall back to the older setup/openIframe approach
    try {
        if (typeof PaystackPop.newTransaction === 'function') {
            PaystackPop.newTransaction(paystackConfig);
        } else {
            const handler = PaystackPop.setup(paystackConfig);
            handler.openIframe();
        }
    } catch (err) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
        showPayStatus('⚠️ Could not open payment window. Please try again.', 'error');
    }
}



function showPayStatus(message, type) {
    const status = document.getElementById('payStatusMsg');
    if (!status) return;
    status.textContent   = message;
    status.style.display = 'block';
    status.className     = `pay-status-msg pay-status-${type}`;
}

function resetPayBtn() {
    const btn = document.getElementById('payNowBtn');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
    }
}


const navigateToSave = (e) => {
    if (e) e.preventDefault();
    document.body.style.cursor = 'wait';
    setTimeout(() => {
        document.body.style.cursor = 'default';
        window.location.href = 'save.html';
    }, 1500);
};
window.navigateToSave = navigateToSave;

const navigateToInvest = (e) => {
    if (e) e.preventDefault();
    document.body.style.cursor = 'wait';
    setTimeout(() => {
        document.body.style.cursor = 'default';
        window.location.href = 'invest.html';
    }, 1500);
};
window.navigateToInvest = navigateToInvest;

window.openPaymentModal  = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.setModalAmount    = setModalAmount;
window.initiatePaystackPayment = initiatePaystackPayment;


function switchTab(tabName) {
    const tabHome = document.getElementById('tabHome');
    const tabPortfolio = document.getElementById('tabPortfolio');
    const homeView = document.getElementById('homeContentView');
    const portfolioView = document.getElementById('portfolioContentView');

    if (tabName === 'home') {
        tabHome.classList.add('active');
        tabPortfolio.classList.remove('active');
        homeView.style.display = 'flex';
        portfolioView.style.display = 'none';
    } else if (tabName === 'portfolio') {
        tabHome.classList.remove('active');
        tabPortfolio.classList.add('active');
        homeView.style.display = 'none';
        portfolioView.style.display = 'block';
        updatePortfolioView();
    }
}

function updatePortfolioView() {
    const bal = getStoredBalance();
    const growthAmountEl = document.getElementById('portfolioGrowthAmount');
    const chartPath = document.getElementById('chartPath');
    const chartEndpoint = document.getElementById('chartEndpoint');

    if (growthAmountEl) {
        if (bal === 0) {
            growthAmountEl.textContent = '₦ 0K';
        } else {
            const kAmount = (bal / 1000).toFixed(1).replace(/\.0$/, '');
            growthAmountEl.textContent = `₦ ${kAmount}K`;
        }
    }

    if (chartPath && chartEndpoint) {
        if (bal > 0) {
            chartPath.setAttribute('d', 'M 0 100 L 60 100 L 120 100 L 180 100 L 240 100 L 300 100 L 360 100 L 420 100 L 500 40');
            chartEndpoint.setAttribute('cy', '40');
        } else {
            chartPath.setAttribute('d', 'M 0 100 L 60 100 L 120 100 L 180 100 L 240 100 L 300 100 L 360 100 L 420 100 L 500 100');
            chartEndpoint.setAttribute('cy', '100');
        }
    }
}

const originalRenderBalance = renderBalance;
renderBalance = function() {
    originalRenderBalance();
    updatePortfolioView();
};

window.switchTab = switchTab;
window.updatePortfolioView = updatePortfolioView;
window.renderBalance = renderBalance;



const DEFAULT_NOTIFICATIONS = [
    {
        id: 1,
        text: "Welcome to Cowrywise! Start your savings journey today.",
        time: "Just now",
        unread: true,
        type: "welcome"
    },
    {
        id: 2,
        text: "Setup your investment plans to start earning competitive returns.",
        time: "1 hour ago",
        unread: true,
        type: "investment"
    }
];

function getNotifications() {
    let notifs = localStorage.getItem('notifications');
    if (!notifs) {
        localStorage.setItem('notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
        return DEFAULT_NOTIFICATIONS;
    }
    return JSON.parse(notifs);
}

function saveNotifications(notifs) {
    localStorage.setItem('notifications', JSON.stringify(notifs));
}

function renderNotifications() {
    const listEl = document.getElementById('notifItemsList');
    const badgeEl = document.getElementById('notifBadge');
    if (!listEl) return;

    const notifs = getNotifications();
    const unreadCount = notifs.filter(n => n.unread).length;

    if (badgeEl) {
        if (unreadCount > 0) {
            badgeEl.style.display = 'block';
        } else {
            badgeEl.style.display = 'none';
        }
    }

    listEl.innerHTML = '';

    if (notifs.length === 0) {
        listEl.innerHTML = `
            <div style="padding: 30px; text-align: center; color: #94a3b8; font-size: 13.5px;">
                <i class="fa-regular fa-bell-slash" style="font-size: 24px; margin-bottom: 8px; display: block; opacity: 0.6;"></i>
                No notifications yet
            </div>
        `;
        return;
    }

    notifs.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notif-item ${notif.unread ? 'unread' : ''}`;
        
        let iconHtml = '<i class="fa-regular fa-bell"></i>';
        if (notif.type === 'welcome') iconHtml = '<i class="fa-solid fa-leaf"></i>';
        if (notif.type === 'payment') iconHtml = '<i class="fa-solid fa-wallet"></i>';
        if (notif.type === 'investment') iconHtml = '<i class="fa-solid fa-chart-line"></i>';

        item.innerHTML = `
            <div class="notif-icon-wrapper">
                ${iconHtml}
            </div>
            <div class="notif-details">
                <span class="notif-text">${notif.text}</span>
                <span class="notif-time">${notif.time}</span>
            </div>
        `;

        item.onclick = function() {
            markNotificationAsRead(notif.id);
        };

        listEl.appendChild(item);
    });
}

function addNotification(text, type = "payment") {
    const notifs = getNotifications();
    const newNotif = {
        id: Date.now(),
        text: text,
        time: "Just now",
        unread: true,
        type: type
    };
    notifs.unshift(newNotif); // prepend
    saveNotifications(notifs);
    renderNotifications();
}

function markNotificationAsRead(id) {
    const notifs = getNotifications();
    const notif = notifs.find(n => n.id === id);
    if (notif) {
        notif.unread = false;
        saveNotifications(notifs);
        renderNotifications();
    }
}

function markAllNotificationsRead(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const notifs = getNotifications();
    notifs.forEach(n => n.unread = false);
    saveNotifications(notifs);
    renderNotifications();
}


function handleSignOut(event) {
    if (event) {
        event.preventDefault();
    }
    
    localStorage.removeItem('currentUser');
    
    window.location.replace('signin.html');
}

window.renderNotifications = renderNotifications;
window.addNotification = addNotification;
window.markAllNotificationsRead = markAllNotificationsRead;
window.handleSignOut = handleSignOut;

var currentSlide = 0;

function goToSlide(index) {
    var slides = document.querySelectorAll('.promo-slide');
    var dots = document.querySelectorAll('.promo-dot');
    for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        dots[i].classList.remove('active');
    }
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function startSlider() {
    var slides = document.querySelectorAll('.promo-slide');
    if (slides.length === 0) return;
    setInterval(function() {
        var next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, 4000);
}

window.goToSlide = goToSlide;
startSlider();


