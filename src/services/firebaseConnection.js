// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyA3JTUkMKpUm9zACJdoaGFElqhxhk9wloI ",
  authDomain: "site-job-founder.firebaseapp.com ",
  projectId: "site-job-founder",
  storageBucket: "site-job-founder.appspot.com",
  messagingSenderId: "1026627261769",
  appId: "1:1026627261769:web:02aa48fda706659dd87698",
  measurementId: "G-90V6B6F4RW"
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);

const auth = getAuth(fireBaseApp)
const db = getFirestore(fireBaseApp)
const storage = getStorage(fireBaseApp)

export {auth, db, storage}