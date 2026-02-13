// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIzs8wwY1ztk178YNaxxLjvQ6JUs0IupU",
  authDomain: "junebird-5846d.firebaseapp.com",
  projectId: "junebird-5846d",
  storageBucket: "junebird-5846d.firebasestorage.app",
  messagingSenderId: "126761520918",
  appId: "1:126761520918:web:4251b1e0c6e5c2372c0a37",
  measurementId: "G-GHDMT02693",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);
