// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "weather-app-4542b.firebaseapp.com",
  projectId: "weather-app-4542b",
  storageBucket: "weather-app-4542b.appspot.com",
  messagingSenderId: "242672911342",
  appId: "1:242672911342:web:7ade9a4aa48843c4aa44ff",
  measurementId: "G-7VT16DWD7Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
