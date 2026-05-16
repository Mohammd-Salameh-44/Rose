import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI_LnzuIpJq86M0uQmNVb_83TrGDWTHwM",
  authDomain: "roseflower-b35d1.firebaseapp.com",
  projectId: "roseflower-b35d1",
  storageBucket: "roseflower-b35d1.firebasestorage.app",
  messagingSenderId: "437081126321",
  appId: "1:437081126321:web:0a8842f60afc89e088f990"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);