import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDxrAF5sC_3IM9FfZ4BqMi4X612bHTaSYA',
  authDomain: 'fitspire-c12f9.firebaseapp.com',
  projectId: 'fitspire-c12f9',
  storageBucket: 'fitspire-c12f9.firebasestorage.app',
  messagingSenderId: '291532001872',
  appId: '1:291532001872:web:45200f7188aa1c67713755',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
