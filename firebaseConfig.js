// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Platform } from 'react-native';
// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, collection} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAvmQeWkdo_vIMWiN9xSS8P18MTM4w7-5A",
  authDomain: "skinsync-ai-app-117fd.firebaseapp.com",
  projectId: "skinsync-ai-app-117fd",
  storageBucket: "skinsync-ai-app-117fd.firebasestorage.app",
  messagingSenderId: "378554661249",
  appId: "1:378554661249:web:9846254d18ee332a251080",
  measurementId: "G-G5FD52B276"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Initialize auth for the first time
    if (Platform.OS !== 'web') {
        initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
    }
} else {
    app = getApp();
}


isSupported().then(supported => {
    if (supported) {
        const analytics = getAnalytics(app);
    }
});

export const auth = getAuth(app);

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');

// Any other Firebase services you want to use
