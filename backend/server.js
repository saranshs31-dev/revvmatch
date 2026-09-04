require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = 5000;

app.use(cors());

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
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});