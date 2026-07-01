# Cowrywise Portfolio Project

A front-end web application that replicates the Cowrywise investment and savings platform. Built with plain HTML, CSS, and JavaScript — no frameworks.

---

## Project Structure

```
project lvl2/
│
├── index.html            Landing page (home)
├── signup.html           Sign up page
├── signin.html           Sign in page
├── dashboard.html        Main user dashboard
├── save.html             Savings page
├── invest.html           Investments page
├── profile.html          User profile page
├── settings.html         Settings page
│
├── style.css             Styles for index.html (landing page)
├── style2.css            Styles for signup.html
├── style3.css            Styles for signin.html
├── dashboard.css         Styles for dashboard.html
├── save.css              Styles for save.html
├── invest.css            Styles for invest.html
├── profile.css           Styles for profile.html
├── settings.css          Styles for settings.html
│
├── script.js             JavaScript for index.html (landing page)
├── signup.js             JavaScript for signup.html
├── signin.js             JavaScript for signin.html
├── dashboard.js          JavaScript for dashboard.html
├── profile.js            JavaScript for profile.html
├── settings.js           JavaScript for settings.html
│
├── gif-logo-loading.gif  Loading animation shown between pages
│
└── img/                  All image assets
    ├── imgi_2_dashboard-logo.svg      Cowrywise logo used in navbar
    ├── imgi_18_AppCard_WorldCup.png   Banner slide 1
    ├── imgi_19_AppCard_Sprout.png     Banner slide 2
    ├── imgi_20_AppCard_Stocks.png     Banner slide 3
    ├── imgi_21_AppCard_Youtube.png    Banner slide 4
    └── ...                            Other images used on landing page
```

---

## How to Run

This is a pure front-end project. No server or installation needed.

1. Download or clone the project folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge).
3. That's it — no npm, no terminal, no setup required.

---

## Pages Overview

### Landing Page (`index.html`)
The home page visitors see first. It shows Cowrywise features, testimonials, and links to sign up or sign in.

### Sign Up (`signup.html`)
A two-column registration form where new users create an account. Fields:
- First Name, Last Name
- Email Address
- Sex, Location
- Password
- Halal Account toggle (with pop-up explanation)

Validation rules:
- Email must be in correct format (e.g. `name@gmail.com`)
- Password must be at least 8 characters, with uppercase, lowercase, number, and a special character
- Real-time feedback shown as the user types (green border = valid, red border = invalid)

### Sign In (`signin.html`)
Users log in with their email and password. The system checks against accounts saved in `localStorage`.

### Dashboard (`dashboard.html`)
The main page after logging in. Features:
- Auto-sliding promo banner (4 images, switches every 4 seconds with dot indicators)
- Portfolio balance display with show/hide toggle
- Quick fund buttons (₦5K, ₦10K, etc.) that open a Paystack payment modal
- Notification dropdown with unread badge
- Profile dropdown (My Profile, Settings, Sign Out)
- Responsive sidebar for mobile

**PIN Security:** First-time users are asked to create a 4-digit PIN when they first enter the dashboard. This PIN is saved to their account. Next time they log in, they go straight to the dashboard (no PIN re-entry needed).

### Save (`save.html`)
Savings management page.

### Invest (`invest.html`)
Investments management page.

### Profile (`profile.html`)
Users can view and edit the information they entered when they signed up:
- First Name, Last Name, Sex, Location
- Upload a profile photo (stored locally)
- Email is shown but cannot be changed

### Settings (`settings.html`)
- **Dark Mode** — toggle between light and dark theme (choice is remembered)
- **Change PIN** — enter and confirm a new 4-digit dashboard PIN
- **Change Password** — enter current password, then set a new one (same rules as sign up)

---

## Authentication & Data Storage

All user data is stored in the browser's `localStorage`. There is no backend database.

| Key | What it stores |
|---|---|
| `users` | Array of all registered user objects |
| `currentUser` | The currently logged-in user object |
| `walletBalance` | The user's current wallet balance |
| `notifications` | Array of notification objects |
| `darkMode` | `"on"` or `"off"` for theme preference |

**Session Guard:** Every protected page (dashboard, profile, settings) checks for `currentUser` in `localStorage` at the top of its JavaScript file. If it's missing, the user is redirected to `signin.html` immediately. This means if someone knows the dashboard URL, they cannot access it without signing in first.

---

## Payment Integration

Payments are handled by **Paystack** using their JavaScript pop-up (client-side only).

- The **public key** (`pk_test_...`) is used in `dashboard.js` — this is safe to be in front-end code.
- When a payment succeeds, Paystack fires a `callback` function that credits the wallet directly.
- This project runs in **test mode**. Use Paystack test card details to simulate payments:
  - Card Number: `4084 0840 8408 4081`
  - Expiry: any future date
  - CVV: `408`
  - PIN: `0000`
  - OTP: `123456`

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and layout |
| JavaScript (ES6) | Logic and interactivity |
| localStorage | Storing user data in the browser |
| Paystack JS SDK | Payment pop-up integration |
| Font Awesome 6 | Icons |
| Google Fonts (Outfit) | Typography |

---

## Features Summary

- ✅ User registration with email and password validation (regex)
- ✅ User login with session management
- ✅ Protected pages (redirect to sign in if not logged in)
- ✅ Dashboard PIN security (create once on first login)
- ✅ Auto-sliding promotional image banner
- ✅ Fund wallet with Paystack payment pop-up
- ✅ Notification system with unread badge
- ✅ Profile page with photo upload
- ✅ Settings page with dark mode, change PIN, change password
- ✅ Fully responsive design (mobile sidebar, hamburger menu)
- ✅ Loading screen animation between page transitions
- ✅ Sign out clears session and blocks dashboard access

---

## Author

Built by Abegunde Inioluwa as a Level 2 JavaScript class project.
