import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const auth = async (req, res, next) => {
  let token = req.header("Authorization");
    
  if (!token) return res.status(401).json({message: 'Access Denied'});

  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);

    if (isBlacklisted) {
      return res.status(401).json({message: 'Token expired. Please log in again.'});
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({message: 'Invalid Token'});
  }
};

export default auth;