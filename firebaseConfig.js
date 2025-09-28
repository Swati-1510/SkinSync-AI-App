import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Platform } from 'react-native';
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
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Initialize auth for the first time
  if (Platform.OS === 'web') {
    auth = getAuth(app); // Standard web initialization
  } else {
    // For native, use persistent storage
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  // Optional: Initialize Analytics
  isSupported().then(supported => supported && getAnalytics(app));
} else {
  app = getApp();
  auth = getAuth(app); // Get existing auth instance
}

export { app, auth };

const db = getFirestore(app);

export { db };

  