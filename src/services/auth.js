// src/services/chat.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Use the same Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoLpA3WUZ7KbdvKod4Y0qIEkGvaqG0R6w",
  authDomain: "dragon-chat-5f663.firebaseapp.com",
  projectId: "dragon-chat-5f663",
  storageBucket: "dragon-chat-5f663.firebasestorage.app",
  messagingSenderId: "612776165330",
  appId: "1:612776165330:web:ea111be65592d853fe120b",
  measurementId: "G-1F3KKR3GTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Rest of your chat service functions...
