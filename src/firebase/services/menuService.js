import { db } from '../config.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const CATEGORY_PRIORITY = {
  'main': 1,
  'side': 2,
  'beverage': 3,
  // Default priority for items without these categories
  'default': 999
};

const menuService = {
  // Add a new menu item
  async addMenuItem(item) {
    try {
      // Validate required fields
      if (!item.name || !item.price || !item.description || !item.image || item.spiceLevel === undefined) {
        throw new Error('Missing required fields');
      }

      const processedItem = {
        name: item.name,
        price: Number(item.price),
        description: item.description,
        spiceLevel: item.spiceLevel, // Accept any value including 0
        image: item.image,
        // Optional fields
        categories: item.categories ? 
          (Array.isArray(item.categories) ? item.categories : item.categories.split(',').map(cat => cat.trim())) 
          : [],
        discountPrice: item.discountPrice ? Number(item.discountPrice) : undefined
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
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort items based on category priority
      return items.sort((a, b) => {
        const aPriority = Math.min(...(a.categories || []).map(cat => 
          CATEGORY_PRIORITY[cat] || CATEGORY_PRIORITY.default
        ));
        const bPriority = Math.min(...(b.categories || []).map(cat => 
          CATEGORY_PRIORITY[cat] || CATEGORY_PRIORITY.default
        ));
        return aPriority - bPriority;
      });
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