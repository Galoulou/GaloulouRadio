// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCy8s8uLzPXkfa7puZTSYc9bW8CTnj9kkQ",
  authDomain: "galoulouradio.firebaseapp.com",
  projectId: "galoulouradio",
  storageBucket: "galoulouradio.firebasestorage.app",
  messagingSenderId: "831136925828",
  appId: "1:831136925828:web:74cc1a0e6c2c6dade75ad1",
  measurementId: "G-DX74GTQNT0"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Initialise Firebase Authentication
export const auth = getAuth(app);
