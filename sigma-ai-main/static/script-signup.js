// Import Firebase modules (ensure this is included in an HTML file as type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// ✅ Firebase Configuration (Your actual credentials)
const firebaseConfig = {
    apiKey: "AIzaSyCK5Px-7bIUKfPwWwFwc8kix5BWtRGeo2E",
    authDomain: "sigma-ai-a8a2c.firebaseapp.com",
    projectId: "sigma-ai-a8a2c",
    storageBucket: "sigma-ai-a8a2c.appspot.com", // 🔹 Fixed storage bucket URL
    messagingSenderId: "384121796827",
    appId: "1:384121796827:web:8266734d1af2912b25f4fe",
    measurementId: "G-TVGK34RHLP"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ✅ Signup Function (Email & Password)
export function signup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Signup Successful! You can now log in.");
            window.location.href = "/"; // Redirect to login
        })
        .catch((error) => {
            alert(error.message);
        });
}

// ✅ Google Sign-in Function
export function googleSignIn() {
    let provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then(() => {
            alert("Signed in successfully with Google!");
            window.location.href = "index.html"; // Redirect to login
        })
        .catch((error) => {
            alert(error.message);
        });
}
