// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIt5QgV5lsEQBh0TTCtdMhudiyPudXKBU",
  authDomain: "planmylife-1c7fd.firebaseapp.com",
  databaseURL: "https://planmylife-1c7fd.firebaseio.com",
  projectId: "planmylife-1c7fd",
  storageBucket: "planmylife-1c7fd.appspot.com",
  messagingSenderId: "29592412564",
  appId: "1:29592412564:web:d0e289b682fb42c1cd2f81",
  measurementId: "G-VTDC7Q4VEN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Functions and get a reference to the service
export const functions = getFunctions(app);

export const GoogleAuth = new GoogleAuthProvider();

export type CollectionType = "default" | "recurring";

export { GoogleAuthProvider, signInWithRedirect, getRedirectResult, Timestamp };
