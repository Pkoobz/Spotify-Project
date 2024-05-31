import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

const getFirebaseErrorMessage = (code: string) => {
  const errorMessages = {
    "auth/email-already-in-use": "Email sudah terdaftar.",
    "auth/invalid-email": "Email tidak valid.",
    "auth/weak-password": "Kata sandi terlalu lemah.",
    "auth/invalid-login-credentials": "Email atau password salah.",
  } as any;

  if (errorMessages.hasOwnProperty(code)) {
    return errorMessages[code];
  }

  // Pesan default jika kode error tidak ditemukan
  return "Terjadi kesalahan pada Firebase.";
};

const handleAuthError = (err: any) => ({
  isRegistered: false,
  error: getFirebaseErrorMessage(err.code),
});

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const userUid = res.user.uid;

    localStorage.setItem("userUid", userUid);

    return {
      isLogged: true,
      data: res,
    };
  } catch (err) {
    return handleAuthError(err);
  }
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const res2 = await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      isAdmin: false,
      playlist: [],
      likedAlbum: [],
      likedArtist: [],
    });
    return {
      isRegistered: true,
      data: res2,
    };
  } catch (err) {
    return handleAuthError(err);
  }
};

export {
  app,
  analytics,
  auth,
  db,
  storage,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
};