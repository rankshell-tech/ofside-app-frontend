// firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Your Firebase config - get these values from your GoogleService-Info.plist
const firebaseConfig = {
  apiKey: "AIzaSyAyph1R0tlmKfcLNKVlGFw1r4AzV6el7fc",
  authDomain: "ofside-dev.firebaseapp.com",
  projectId: "ofside-dev",
  storageBucket: "ofside-dev.firebasestorage.app",
  messagingSenderId: "228899724908",
  appId: "1:228899724908:ios:7ed6228764677130f08249"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// In Firebase v12, persistence is automatically handled
// No need for manual persistence setup

export default app;