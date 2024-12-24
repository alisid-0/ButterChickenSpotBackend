import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBisWJzOFZ4IsIMcPa3nDRsQX2hyxvdb48",
  authDomain: "butterchicken9835.firebaseapp.com",
  projectId: "butterchicken9835",
  storageBucket: "butterchicken9835.firebasestorage.app",
  messagingSenderId: "365624556467",
  appId: "1:365624556467:web:c5dc9f6ede6269568ca9c6",
  measurementId: "G-6XGGLB5TDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services
export { auth, db, storage }; 