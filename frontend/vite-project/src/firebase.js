// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "genwebai-646d4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "genwebai-646d4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "genwebai-646d4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "928834443127",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:928834443127:web:d5de78624fd85c7254b372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)

const provider = new GoogleAuthProvider()

export{auth,provider}