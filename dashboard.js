let isBalanceVisible = true;

if (!localStorage.getItem('currentUser')) {
    window.location.replace('signin.html');
}

// Apply dark mode globally on every page load
function applyDarkModeEarly() {
    if (localStorage.getItem('darkMode') === 'on') {
        document.documentElement.classList.add('dark');
        if (document.body) {
            document.body.classList.add('dark');
        }
    }
}
applyDarkModeEarly();

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
            for (let i = 0; i < avatarEls.length; i++) {
                const avatarEl = avatarEls[i];
                avatarEl.innerHTML = '<img src="' + currentUser.profilePhoto + '" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
            }
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
        const next = current.nextElementSibling;
        if (next) next.focus();
    }
    if (event.key === 'Backspace' && current.value.length === 0) {
        const prev = current.previousElementSibling;
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
    for(let j=0; j<confirmInputs.length; j++) {
        confirmPin += confirmInputs[j].value;
    }
    
    if (createPin.length !== 4 || confirmPin.length !== 4) {
        alert('Please fill in all 4 digits for both fields.');
        return;
    }
    
    if (createPin !== confirmPin) {
        alert('PINs do not match. Please try again.');
        for (let k = 0; k < createInputs.length; k++) {
            createInputs[k].value = '';
            confirmInputs[k].value = '';
        }
        createInputs[0].focus();
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.pin = createPin;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = -1;
    for (let u = 0; u < allUsers.length; u++) {
        if (allUsers[u].email === currentUser.email) {
            userIndex = u;
            break;
        }
    }
    
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
    
    let userIndex = -1;
    for (let u = 0; u < allUsers.length; u++) {
        if (allUsers[u].email === currentUser.email) {
            userIndex = u;
            break;
        }
    }
    
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
    
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = newFirst;
    
    const profileNameEl = document.getElementById('profileName');
    if (profileNameEl) profileNameEl.textContent = newFirst + ' ' + newLast;
    
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
        balanceAmount.innerHTML = "₦ " + bal.toLocaleString('en-NG') + "<span class=\"decimals\">.00</span>";
    }
}

function navigateToPayment(amount) {
    document.body.style.cursor = 'wait';
    setTimeout(function() {
        document.body.style.cursor = 'default';
        if (amount) {
            window.location.href = 'payment.html?amount=' + amount;
        } else {
            window.location.href = 'payment.html';
        }
    }, 500);
}

function navigateToSave(e) {
    if (e) e.preventDefault();
    document.body.style.cursor = 'wait';
    setTimeout(function() {
        document.body.style.cursor = 'default';
        window.location.href = 'save.html';
    }, 1500);
}
window.navigateToSave = navigateToSave;

function navigateToInvest(e) {
    if (e) e.preventDefault();
    document.body.style.cursor = 'wait';
    setTimeout(function() {
        document.body.style.cursor = 'default';
        window.location.href = 'invest.html';
    }, 1500);
}
window.navigateToInvest = navigateToInvest;

window.navigateToPayment = navigateToPayment;

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
            growthAmountEl.textContent = "₦ " + kAmount + "K";
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
    const notifs = localStorage.getItem('notifications');
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
    let unreadCount = 0;
    for (let i = 0; i < notifs.length; i++) {
        if (notifs[i].unread) {
            unreadCount++;
        }
    }

    if (badgeEl) {
        if (unreadCount > 0) {
            badgeEl.style.display = 'block';
        } else {
            badgeEl.style.display = 'none';
        }
    }

    listEl.innerHTML = '';

    if (notifs.length === 0) {
        listEl.innerHTML = "" +
            "<div style=\"padding: 30px; text-align: center; color: #94a3b8; font-size: 13.5px;\">" +
                "<i class=\"fa-regular fa-bell-slash\" style=\"font-size: 24px; margin-bottom: 8px; display: block; opacity: 0.6;\"></i>" +
                "No notifications yet" +
            "</div>";
        return;
    }

    for (let j = 0; j < notifs.length; j++) {
        const notif = notifs[j];
        const item = document.createElement('div');
        
        let className = "notif-item";
        if (notif.unread) {
            className += " unread";
        }
        item.className = className;
        
        let iconHtml = '<i class="fa-regular fa-bell"></i>';
        if (notif.type === 'welcome') iconHtml = '<i class="fa-solid fa-leaf"></i>';
        if (notif.type === 'payment') iconHtml = '<i class="fa-solid fa-wallet"></i>';
        if (notif.type === 'investment') iconHtml = '<i class="fa-solid fa-chart-line"></i>';

        item.innerHTML = "" +
            "<div class=\"notif-icon-wrapper\">" +
                iconHtml +
            "</div>" +
            "<div class=\"notif-details\">" +
                "<span class=\"notif-text\">" + notif.text + "</span>" +
                "<span class=\"notif-time\">" + notif.time + "</span>" +
            "</div>";

        item.setAttribute('data-id', notif.id);
        item.onclick = function() {
            const clickedId = parseInt(this.getAttribute('data-id'), 10);
            markNotificationAsRead(clickedId);
        };

        listEl.appendChild(item);
    }
}

function addNotification(text, type) {
    if (!type) type = "payment";
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
    let notif = null;
    
    for (let i = 0; i < notifs.length; i++) {
        if (notifs[i].id === id) {
            notif = notifs[i];
            break;
        }
    }
    
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
    for (let i = 0; i < notifs.length; i++) {
        notifs[i].unread = false;
    }
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

let currentSlide = 0;

function goToSlide(index) {
    const slides = document.querySelectorAll('.promo-slide');
    const dots = document.querySelectorAll('.promo-dot');
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        dots[i].classList.remove('active');
    }
    currentSlide = index;
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function startSlider() {
    const slides = document.querySelectorAll('.promo-slide');
    if (slides.length === 0) return;
    setInterval(function() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, 4000);
}

window.goToSlide = goToSlide;
startSlider();
