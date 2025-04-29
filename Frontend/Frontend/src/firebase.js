// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCholDvOuKrxwSQQwul0B3-buuCOsDPyqM",
  authDomain: "eduflex-ai-63ad4.firebaseapp.com",
  projectId: "eduflex-ai-63ad4",
  storageBucket: "eduflex-ai-63ad4.appspot.com", // ✅ fixed the typo: .app ➝ .appspot.com
  messagingSenderId: "808116947654",
  appId: "1:808116947654:web:019813a219c63f4475a5c7",
  measurementId: "G-0BXZMDWPVN"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Set up Firebase Auth with Google
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
