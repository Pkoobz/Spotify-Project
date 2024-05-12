import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  
import {connectAuthEmulator,sendPasswordResetEmail,confirmPasswordReset} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoaXnsgDLTyGFMZ0AOzypIfmAzfuOt2IA",
  authDomain: "abef-77b9a.firebaseapp.com",
  projectId: "abef-77b9a",
  storageBucket: "abef-77b9a.appspot.com",
  messagingSenderId: "749041026744",
  appId: "1:749041026744:web:798ab8ac4e942bc1e7164d",
  measurementId: "G-94HY2TXR2B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;