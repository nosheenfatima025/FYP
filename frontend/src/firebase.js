import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyBiSR20adUpBvl0ZyRGhA-IuPose0a6Sb4",
  authDomain: "parkify-e9032.firebaseapp.com",
  projectId: "parkify-e9032",
  storageBucket: "parkify-e9032.firebasestorage.app",
  messagingSenderId: "64023092936",
  appId: "1:64023092936:web:5f267a4290ba8037d54ffd",
  measurementId: "G-ML8DT75JK9"
};
 
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
 
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);