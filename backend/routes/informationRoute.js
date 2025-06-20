import express from 'express';
import Law from '../models/law.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const laws = await Law.find();
    res.status(200).json(laws);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching laws', error: error.message });
  }
});

export default router;
