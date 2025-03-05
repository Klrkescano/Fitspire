import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDxrAF5sC_3IM9FfZ4BqMi4X612bHTaSYA',
  authDomain: 'fitspire-c12f9.firebaseapp.com',
  projectId: 'fitspire-c12f9',
  storageBucket: 'fitspire-c12f9.appspot.com',
  messagingSenderId: '291532001872',
  appId: '1:291532001872:web:45200f7188aa1c67713755',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence (using AsyncStorage)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore Database
const db = getFirestore(app);

export { app, auth, db };
