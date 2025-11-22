import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDdwibX015m69zD8EiKNuqmfD3aCIbGjU",
  authDomain: "financeapp-8f2a9.firebaseapp.com",
  projectId: "financeapp-8f2a9",
  storageBucket: "financeapp-8f2a9.firebasestorage.app",
  messagingSenderId: "230255302860",
  appId: "1:230255302860:web:886ae6e34a7bb953d60a69",
  measurementId: "G-EPQ0S3K0XD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
