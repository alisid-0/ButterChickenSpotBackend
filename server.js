import express from 'express';
import cors from 'cors';
import menuService from './src/firebase/services/menuService.js';

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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 