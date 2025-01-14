import express from 'express';
import cors from 'cors';
import menuService from './src/firebase/services/menuService.js';
import newsletterService from './src/firebase/services/newsletterService.js';
import userService from './src/firebase/services/userService.js';
import orderService from './src/firebase/services/orderService.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/menu', async (req, res) => {
  try {
    const items = await menuService.getAllMenuItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const newItem = await menuService.addMenuItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const updatedItem = await menuService.updateMenuItem(req.params.id, req.body);
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    await menuService.deleteMenuItem(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/newsletter', async (req, res) => {
  try {
    const posts = await newsletterService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/newsletter', async (req, res) => {
  try {
    const newPost = await newsletterService.addPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/newsletter/:id', async (req, res) => {
  try {
    const updatedPost = await newsletterService.updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/newsletter/:id', async (req, res) => {
  try {
    await newsletterService.deletePost(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User routes
app.post('/api/users/register', async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/users/logout', async (req, res) => {
  try {
    await userService.logoutUser();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/current', async (req, res) => {
  try {
    const user = await userService.getCurrentUser();
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/:id/loyalty-points', async (req, res) => {
  try {
    const { points } = req.body;
    if (points === undefined) {
      res.status(400).json({ error: 'Points value is required' });
      return;
    }
    
    const result = await userService.updateLoyaltyPoints(req.params.id, points);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users/:id/loyalty-points', async (req, res) => {
  try {
    const user = await userService.getCurrentUser();
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    res.json({ loyaltyPoints: user.loyaltyPoints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order routes
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.params.userId);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 