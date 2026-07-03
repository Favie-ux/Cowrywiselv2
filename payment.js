const PAYSTACK_PUBLIC_KEY = 'pk_test_4f006c972400f69f3ce830536d93cb16cd3ac0ab';

// Apply dark mode early
if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark');
}

// Ensure the amount is filled if passed in URL
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const amount = params.get('amount');
    if (amount) {
        document.getElementById('amountInput').value = amount;
    }
});

function selectAmount(amount, btnElement) {
    document.getElementById('amountInput').value = amount;
    clearPillActive();
    if (btnElement) {
        btnElement.classList.add('active');
    }
}

function clearPillActive() {
    document.querySelectorAll('.pay-pill').forEach(btn => btn.classList.remove('active'));
}

function showStatus(msg, type) {
    const el = document.getElementById('payStatusMsg');
    el.textContent = msg;
    el.className = 'pay-status ' + type;
    el.style.display = 'block';
}

function startPayment() {
    const input = document.getElementById('amountInput');
    const btn = document.getElementById('payBtn');
    const amount = parseFloat(input.value);

    if (!amount || amount < 100) {
        showStatus('⚠️ Please enter a minimum of ₦100.', 'warn');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = currentUser.email || 'customer@cowrywise.demo';

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening Paystack...';
    document.getElementById('payStatusMsg').style.display = 'none';

    if (typeof PaystackPop === 'undefined') {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
        showStatus('⚠️ Paystack failed to load. Check connection.', 'error');
        return;
    }

    const config = {
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: Math.round(amount * 100),
        currency: 'NGN',
        ref: 'CW_' + Date.now() + '_' + Math.floor(Math.random() * 1e6),
        onSuccess: function(transaction) {
            handleSuccess(amount);
        },
        onCancel: function() {
            handleCancel(btn);
        },
        // Fallbacks for older API
        callback: function(response) {
            handleSuccess(amount);
        },
        onClose: function() {
            handleCancel(btn);
        }
    };

    try {
        if (typeof PaystackPop.newTransaction === 'function') {
            PaystackPop.newTransaction(config);
        } else {
            const handler = PaystackPop.setup(config);
            handler.openIframe();
        }
    } catch (e) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
        showStatus('⚠️ Could not open payment window.', 'error');
    }
}

function handleSuccess(amount) {
    const btn = document.getElementById('payBtn');
    
    // Update balance
    let currentBal = parseFloat(localStorage.getItem('walletBalance') || '0');
    localStorage.setItem('walletBalance', String(currentBal + amount));

    // Add notification
    let notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifs.unshift({
        id: Date.now(),
        text: `₦${amount.toLocaleString('en-NG')} successfully added to your Naira wallet.`,
        time: "Just now",
        unread: true,
        type: "payment"
    });
    localStorage.setItem('notifications', JSON.stringify(notifs));

    showStatus(`✅ Payment successful! Redirecting...`, 'success');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Confirmed';
    
    setTimeout(() => {
        window.location.replace('dashboard.html');
    }, 2000);
}

function handleCancel(btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely with Paystack';
    showStatus('Payment window closed. Try again when ready.', 'warn');
}
