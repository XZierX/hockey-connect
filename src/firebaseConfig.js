// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdbht0rGYQxDvq4KGrma3Qq0L-cPmrJ1A",
  authDomain: "hockeyconnect-96fbf.firebaseapp.com",
  projectId: "hockeyconnect-96fbf",
  storageBucket: "hockeyconnect-96fbf.firebasestorage.app",
  messagingSenderId: "261240153344",
  appId: "1:261240153344:web:db4d1e571b5a55aef0ffe5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
