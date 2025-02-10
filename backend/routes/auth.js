import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import redisClient from '../config/redis.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Register User
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;

  try {
    let user = await User.findOne({email});

    if (user) {
      return res.status(400).json({message: 'User already exists'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({name, email, password: hashedPassword});
    await user.save();

    res.status(201).json({message: 'User registered successfully'});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Login User
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1h'});

    res.json({token, user});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Logout User (Blacklist Token)
router.post('/logout', async (req, res) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(400).json({message: 'No token provided'});
  }

  token = token.replace('Bearer ', '');

  try {
    // Get token expiration time
    const decoded = jwt.verify(token, JWT_SECRET);
    const expiresAt = decoded.exp - Math.floor(Date.now() / 1000);

    // Store token in Redis blacklist
    await redisClient.setEx(`blacklist:${token}`, expiresAt, 'blacklisted');

    res.json({message: 'Logged out successfully'});
  } catch (err) {
    res.status(400).json({message: 'Invalid Token'});
  }
});

export default router;
