// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDF1EElCX1Ilb8u8objkYOg-ApXnJWbog4",
  authDomain: "flashcard-saas-9b1bd.firebaseapp.com",
  projectId: "flashcard-saas-9b1bd",
  storageBucket: "flashcard-saas-9b1bd.appspot.com",
  messagingSenderId: "522215243685",
  appId: "1:522215243685:web:966b606dde7a410db6b24c",
  measurementId: "G-4DZWXCQBFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export{db}