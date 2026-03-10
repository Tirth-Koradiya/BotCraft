// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Paste your Firebase configuration details from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA2yR--vPXFQPpL5dcGbMRt1UC8EeIxqdQ",
  authDomain: "botcraft-19a30.firebaseapp.com",
  projectId: "botcraft-19a30",
  storageBucket: "botcraft-19a30.firebasestorage.app",
  messagingSenderId: "510570336831",
  appId: "1:510570336831:web:4067686760124637ff5e8a",
  measurementId: "G-QF4QN50XS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the authentication instance
export const auth = getAuth(app);

// Explicitly set Firebase persistence to use localStorage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistence successfully set.
    console.log("Firebase auth persistence set to localStorage");
  })
  .catch((error) => {
    console.error("Error setting Firebase auth persistence:", error);
  });

// Export a Google provider for OAuth sign in
export const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const loginWithEmailPassword = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmailPassword = async (
  email: string,
  password: string,
  name: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Update display name after signing up
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential;
};

export const logoutUser = () => {
  return signOut(auth);
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
