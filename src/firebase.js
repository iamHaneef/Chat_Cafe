import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_NyY84rCd46nCalUKWt9XPzgVqZyu-RE",
  authDomain: "chat-1a0fc.firebaseapp.com",
  projectId: "chat-1a0fc",
  storageBucket: "chat-1a0fc.appspot.com",
  messagingSenderId: "592144633386",
  appId: "1:592144633386:web:ea2e5514831011e8e03d53",
  measurementId: "G-FMKZ5SM0C3"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app)