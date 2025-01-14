import { db, storage } from '../config.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getCSTTimestamp } from '../../utils/dateUtils.js';

const newsletterService = {
  async addPost(post) {
    try {
      if (!post.title || !post.content || !post.author) {
        throw new Error('Missing required fields');
      }

      let imageUrl = post.image || null;

      if (post.imageFile) {
        const storageRef = ref(storage, `newsletter/${Date.now()}_${post.imageFile.name}`);
        await uploadBytes(storageRef, post.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const processedPost = {
        title: post.title,
        content: post.content,
        author: post.author,
        publishDate: getCSTTimestamp(),
        image: imageUrl
      };

      const newsletterCollection = collection(db, 'newsletter');
      const docRef = await addDoc(newsletterCollection, processedPost);
      return { id: docRef.id, ...processedPost };
    } catch (error) {
      throw new Error(`Error adding post: ${error}`);
    }
  },

  async getAllPosts() {
    try {
      const newsletterCollection = collection(db, 'newsletter');
      const snapshot = await getDocs(newsletterCollection);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return posts.sort((a, b) => 
        new Date(b.publishDate) - new Date(a.publishDate)
      );
    } catch (error) {
      throw new Error(`Error getting posts: ${error}`);
    }
  },

  async updatePost(id, updates) {
    try {
      const newsletterDoc = doc(db, 'newsletter', id);
      await updateDoc(newsletterDoc, updates);
      return { id, ...updates };
    } catch (error) {
      throw new Error(`Error updating post: ${error}`);
    }
  },

  async deletePost(id) {
    try {
      const newsletterDoc = doc(db, 'newsletter', id);
      await deleteDoc(newsletterDoc);
      return id;
    } catch (error) {
      throw new Error(`Error deleting post: ${error}`);
    }
  }
};

export default newsletterService; 