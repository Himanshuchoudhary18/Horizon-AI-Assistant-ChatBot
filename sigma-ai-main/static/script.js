// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCK5Px-7bIUKfPwWwFwc8kix5BWtRGeo2E",
    authDomain: "sigma-ai-a8a2c.firebaseapp.com",
    projectId: "sigma-ai-a8a2c",
    storageBucket: "sigma-ai-a8a2c.appspot.com",
    messagingSenderId: "384121796827",
    appId: "1:384121796827:web:8266734d1af2912b25f4fe",
    measurementId: "G-TVGK34RHLP"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ✅ Disable Firebase Auto-login After Refresh
auth.signOut();  // 🔹 Force logout on page load to prevent auto-login

// ✅ Ensure User Manually Logs In
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname === "/") {
        console.log("User found but requires manual login.");
        auth.signOut();  // 🔹 Prevent auto-login, force manual login
    }
});

// ✅ Handle Login Form Submission (Email & Password)
document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('login-email').value.trim();
    let password = document.getElementById('login-password').value.trim();

    if (email === '' || password === '') {
        alert('⚠️ Please fill in all fields.');
        return;
    }

    // 🔹 Firebase Authentication (Email & Password)
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("✅ Login Successful!");
            sessionStorage.setItem("user", JSON.stringify(userCredential.user)); // Store session
            window.location.href = "/model"; // Redirect to model page
        })
        .catch((error) => {
            alert(`❌ Error: ${error.message}`);
        });
});

// ✅ Google Sign-in Function
document.getElementById('google-login').addEventListener('click', function() {
    let provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((userCredential) => {
            alert("✅ Signed in successfully with Google!");
            sessionStorage.setItem("user", JSON.stringify(userCredential.user)); // Store session
            window.location.href = "/model"; // Redirect to model page
        })
        .catch((error) => {
            alert(`❌ Error: ${error.message}`);
        });
});

// ✅ Ensure User is Logged In Before Accessing `model.html`
if (window.location.pathname === "/model") {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert("⚠️ You need to log in first.");
            window.location.href = "/"; // Redirect to login page
        }
    });
}

// ✅ Logout Function (Fix Auto-login After Logout)
document.getElementById('logout-btn')?.addEventListener('click', function() {
    signOut(auth)
        .then(() => {
            sessionStorage.removeItem("user"); // Clear session
            alert("✅ Logged out successfully!");
            window.location.href = "/"; // ✅ Redirect to home page
            setTimeout(() => auth.signOut(), 1000); // 🔹 Ensure Firebase logs out completely
        })
        .catch((error) => {
            alert(`❌ Error: ${error.message}`);
        });
});

// ✅ Close Button (For Login Popup)
document.querySelector('.close-btn')?.addEventListener('click', function() {
    document.querySelector('.login-container').style.display = 'none';
});
