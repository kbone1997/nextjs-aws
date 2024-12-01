// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6jNIEGP0yJyEr-p50c7cY144Y_nG9k6A",
    authDomain: "nextjs-authentication-5fb8e.firebaseapp.com",
    projectId: "nextjs-authentication-5fb8e",
    storageBucket: "nextjs-authentication-5fb8e.firebasestorage.app",
    messagingSenderId: "1068478469784",
    appId: "1:1068478469784:web:1540b57a0db9c2720d62ed",
    measurementId: "G-ZHPBR688L6"
};

const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user"); // Add necessary scopes

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { githubProvider };