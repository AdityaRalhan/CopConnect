const User = require('../models/User');
const generateToken = require('../utils/jwt');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ userId: user._id, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.status(200).json({ userId: user._id, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = { register, login };
