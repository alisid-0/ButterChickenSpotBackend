import { db } from '../config.js';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const menuService = {
  // Add a new menu item
  async addMenuItem(item) {
    try {
      // Validate required fields
      if (!item.name || !item.price || !item.description || !item.spiceLevel) {
        throw new Error('Missing required fields');
      }

      const processedItem = {
        name: item.name,
        price: item.price,
        description: item.description,
        spiceLevel: item.spiceLevel,
        // Optional fields
        categories: item.categories ? 
          (Array.isArray(item.categories) ? item.categories : [item.categories]) 
          : undefined,
        discountPrice: item.discountPrice || undefined
      };

      // Remove undefined optional fields
      Object.keys(processedItem).forEach(key => 
        processedItem[key] === undefined && delete processedItem[key]
      );

      const menuCollection = collection(db, 'menu');
      const docRef = await addDoc(menuCollection, processedItem);
      return { id: docRef.id, ...processedItem };
    } catch (error) {
      throw new Error(`Error adding menu item: ${error}`);
    }
  },

  // Get all menu items
  async getAllMenuItems() {
    try {
      const menuCollection = collection(db, 'menu');
      const snapshot = await getDocs(menuCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error getting menu items: ${error}`);
    }
  },

  // Update a menu item
  async updateMenuItem(id, updates) {
    try {
      if (updates.categories) {
        updates.categories = Array.isArray(updates.categories) ? 
          updates.categories : [updates.categories];
      }

      const menuDoc = doc(db, 'menu', id);
      await updateDoc(menuDoc, updates);
      return { id, ...updates };
    } catch (error) {
      throw new Error(`Error updating menu item: ${error}`);
    }
  },

  // Delete a menu item
  async deleteMenuItem(id) {
    try {
      const menuDoc = doc(db, 'menu', id);
      await deleteDoc(menuDoc);
      return id;
    } catch (error) {
      throw new Error(`Error deleting menu item: ${error}`);
    }
  }
};

export default menuService; 