require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('./generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'RevMatch backend is alive!' });
});

app.get('/api/makes', async (req, res) => {
  try {
    const makes = await prisma.makes.findMany();
    res.json(makes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch makes' });
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const { make_id } = req.query;

    const models = await prisma.models.findMany({
      where: make_id ? { make_id: parseInt(make_id) } : {},
    });

    res.json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.get('/api/generations', async (req, res) => {
  try {
    const { model_id } = req.query;

    const generations = await prisma.generations.findMany({
      where: model_id ? { model_id: parseInt(model_id) } : {},
    });

    res.json(generations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch generations' });
  }
});

app.get('/api/parts', async (req, res) => {
  try {
    const { generation_id } = req.query;

    const parts = await prisma.parts.findMany({
      where: generation_id
        ? {
            part_fitments: {
              some: {
                generation_id: parseInt(generation_id),
              },
            },
          }
        : {},
    });

    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch parts' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are all required' });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: { name, email, password_hash: passwordHash }
    });

    res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/api/cart', requireAuth, async (req, res) => {
  try {
    const cartItems = await prisma.cart_items.findMany({
      where: { user_id: req.user.id },
      include: { parts: true },
    });

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart', requireAuth, async (req, res) => {
  try {
    const { part_id } = req.body;

    if (!part_id) {
      return res.status(400).json({ error: 'part_id is required' });
    }

    const existingItem = await prisma.cart_items.findUnique({
      where: {
        user_id_part_id: { user_id: req.user.id, part_id: parseInt(part_id) },
      },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
        include: { parts: true },
      });
    } else {
      cartItem = await prisma.cart_items.create({
        data: { user_id: req.user.id, part_id: parseInt(part_id), quantity: 1 },
        include: { parts: true },
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.patch('/api/cart/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const item = await prisma.cart_items.findUnique({ where: { id: parseInt(id) } });
    if (!item || item.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const updated = await prisma.cart_items.update({
      where: { id: parseInt(id) },
      data: { quantity: parseInt(quantity) },
      include: { parts: true },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

app.delete('/api/cart/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.cart_items.findUnique({ where: { id: parseInt(id) } });
    if (!item || item.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cart_items.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});