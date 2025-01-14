import { db } from '../config.js';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, query, where, orderBy } from 'firebase/firestore';

const orderService = {
  async createOrder(orderData) {
    try {
      if (!orderData.userId || !orderData.items || !orderData.total) {
        throw new Error('Missing required fields');
      }

      const processedOrder = {
        userId: orderData.userId,
        items: orderData.items,
        total: Number(orderData.total),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        specialInstructions: orderData.specialInstructions || '',
        contactNumber: orderData.contactNumber || '',
        paymentMethod: orderData.paymentMethod || 'cash',
        pointsEarned: Math.floor(orderData.total)  // 1 point per dollar
      };

      const orderCollection = collection(db, 'orders');
      const docRef = await addDoc(orderCollection, processedOrder);
      return { id: docRef.id, ...processedOrder };
    } catch (error) {
      throw new Error(`Error creating order: ${error}`);
    }
  },

  async getOrder(orderId) {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      return { id: orderDoc.id, ...orderDoc.data() };
    } catch (error) {
      throw new Error(`Error getting order: ${error}`);
    }
  },

  async getUserOrders(userId) {
    try {
      const orderCollection = collection(db, 'orders');
      const q = query(
        orderCollection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error getting user orders: ${error}`);
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status, 
        updatedAt: new Date().toISOString() 
      });
      return { id: orderId, status };
    } catch (error) {
      throw new Error(`Error updating order status: ${error}`);
    }
  }
};

export default orderService; 