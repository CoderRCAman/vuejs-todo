import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCLPw8RX7z-hpvclyeKkT9L6rm2kCeRO6I",
  authDomain: "vue-firebase-da7ae.firebaseapp.com",
  projectId: "vue-firebase-da7ae",
  storageBucket: "vue-firebase-da7ae.appspot.com",
  messagingSenderId: "727913421602",
  appId: "1:727913421602:web:9102dbd67cc9db88df237b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
