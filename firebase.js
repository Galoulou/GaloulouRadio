// ============================================================
// 🔥 FIREBASE - GALOULOURADIO
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ============================================================
// ⚙️ CONFIGURATION
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCy8s8uLzPXkfa7puZTSYc9bW8CTnj9kkQ",
    authDomain: "galoulouradio.firebaseapp.com",
    projectId: "galoulouradio",
    storageBucket: "galoulouradio.firebasestorage.app",
    messagingSenderId: "831136925828",
    appId: "1:831136925828:web:74cc1a0e6c2c6dade75ad1",
    measurementId: "G-DX74GTQNT0"
};


// ============================================================
// 🚀 INITIALISATION
// ============================================================

const app = initializeApp(firebaseConfig);


// ============================================================
// 🔐 AUTHENTICATION
// ============================================================

const auth = getAuth(app);


// ============================================================
// ☁️ REALTIME DATABASE
// ============================================================

const db = getDatabase(app);


// ============================================================
// 📤 EXPORT
// ============================================================

export {
    app,
    auth,
    db
};


console.log("🔥 Firebase est correctement initialisé !");
console.log("🔐 Firebase Authentication : OK");
console.log("☁️ Firebase Realtime Database : OK");
