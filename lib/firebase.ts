import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAcyxFqi-MOnO2JGpA8aLW7tQ1NxQ3P9OY",
  authDomain: "agriforecast01.firebaseapp.com",
  projectId: "agriforecast01",
  storageBucket: "agriforecast01.firebasestorage.app",
  messagingSenderId: "608879399496",
  appId: "1:608879399496:web:cb71bc534d8456e446fe7d",
  measurementId: "G-H5YY5BH667"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Analytics is only supported in browser
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, auth, db, googleProvider, analytics };
