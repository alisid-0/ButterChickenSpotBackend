import { db, auth } from '../config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser as deleteAuthUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { getCSTTimestamp } from '../../utils/dateUtils.js';

const userService = {
  async registerUser(userData) {
    try {
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('Missing required fields');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      const userDoc = {
        uid: userCredential.user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        address: userData.address || null,
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
        role: 'customer'
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
      
      const { password, ...userWithoutPassword } = userData;
      return { ...userWithoutPassword, uid: userCredential.user.uid, loyaltyPoints: 0, role: 'customer' };
    } catch (error) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  },

  async updateLoyaltyPoints(uid, points) {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const currentPoints = userDoc.data().loyaltyPoints || 0;
      const newPoints = currentPoints + points;

      await updateDoc(userRef, { loyaltyPoints: newPoints });
      return { uid, loyaltyPoints: newPoints };
    } catch (error) {
      throw new Error(`Error updating loyalty points: ${error.message}`);
    }
  },

  async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      let userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create the user document if it doesn't exist
        const newUserDoc = {
          uid: userCredential.user.uid,
          firstName: userCredential.user.displayName.split(' ')[0],
          lastName: userCredential.user.displayName.split(' ')[1],
          email: userCredential.user.email,
          loyaltyPoints: 0,
          createdAt: getCSTTimestamp(),
          role: 'customer'
        };
        await setDoc(userDocRef, newUserDoc);
        userDoc = await getDoc(userDocRef);
      }

      return { uid: userCredential.user.uid, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Error logging in: ${error.message}`);
    }
  },

  async logoutUser() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Error logging out: ${error.message}`);
    }
  },

  async getCurrentUser() {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return null;

      return { uid: user.uid, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Error getting current user: ${error.message}`);
    }
  },

  async updateUser(uid, updates) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
      return { uid, ...updates };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  },

  async deleteUser(uid) {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', uid));
      
      // Delete from Firebase Auth
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        await user.delete();
      }
      
      return uid;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
};

export default userService; 