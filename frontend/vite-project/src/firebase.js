// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-646d4.firebaseapp.com",
  projectId: "genwebai-646d4",
  storageBucket: "genwebai-646d4.firebasestorage.app",
  messagingSenderId: "928834443127",
  appId: "1:928834443127:web:d5de78624fd85c7254b372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)

const provider = new GoogleAuthProvider()

export{auth,provider}