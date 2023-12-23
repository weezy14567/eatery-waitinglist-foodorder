// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBkD30c-ODxHn-T0YLXUxtxPpKTPGZNKqY",
  authDomain: "neweaterywaitinglist.firebaseapp.com",
  projectId: "neweaterywaitinglist",
  storageBucket: "neweaterywaitinglist.appspot.com",
  messagingSenderId: "777582407704",
  appId: "1:777582407704:web:bdcca2326503167d83536d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();