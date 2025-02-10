import User from '../models/User.js';
import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();
const ALLOWED_USER_FIELDS = '_id name email';

const toUserObject = (user) => {
  const pick = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
  const userObjectFields = ALLOWED_USER_FIELDS.split(' ');

  return pick(user.toJSON(), userObjectFields);
}

// Get Friends List
router.get('/:userId', auth, async (req, res, next) => {
  const {page = 1, limit = 10, search = ''} = req.query;
  const {userId} = req.params;

  try {
    const user = await User.findById(userId)
      .select(ALLOWED_USER_FIELDS)
      .populate('friends', ALLOWED_USER_FIELDS)

    if (!user) return res.status(404).json({message: 'User not found'});

    let friendsList = user.friends;

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      friendsList = friendsList.filter((friend) => regex.test(friend.name) || regex.test(friend.email));
    }

    // Apply pagination
    const total = friendsList.length;
    const paginatedFriends = friendsList.slice((page - 1) * limit, page * limit);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      friends: paginatedFriends,
    });
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Get Friend Request List
router.get('/:userId/requests', auth, async (req, res, next) => {
  const {page = 1, limit = 10} = req.query;
  const {userId} = req.params;

  try {
    const user = await User.findById(userId)
      .select(ALLOWED_USER_FIELDS)
      .populate('friends', ALLOWED_USER_FIELDS)
      .populate('friendRequests', ALLOWED_USER_FIELDS);

    if (!user) return res.status(404).json({ message: 'User not found' });

    let frienRequestList = user.friendRequests;

    // Apply pagination
    const total = frienRequestList.length;
    const paginatedFriendRequests = frienRequestList.slice((page - 1) * limit, page * limit);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      requests: paginatedFriendRequests,
    });
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Send Friend Request
router.post('/request/send', auth, async (req, res, next) => {
  const { userId, username } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findOne({name: username});

    if (!friend) return next({ statusCode: 404, message: 'User not found' });

    if (!friend.friendRequests.includes(userId)) {
      friend.friendRequests.push(userId);

      await friend.save();
    }

    const notification = {
      type: 'friend_request',
      data: toUserObject(user)
    };

    // Emit real-time notification if the user is online
    const friendSocketId = req.onlineUsers.get(friend._id.toString());

    if (friendSocketId) {
      req.io.to(friendSocketId).emit('friend_request', notification.data);
    } else {
      // Store notification in the database if the user is offline
      friend.pendingNotifications.push(notification);
      await friend.save();
    }

    res.json(toUserObject(user));
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Accept Friend Request
router.post('/request/accept', auth, async (req, res, next) => {
  const {userId, friendId} = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return next({statusCode: 404, message: 'User not found'});

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    const notification = {
      type: 'friend_request_accepted',
      data: toUserObject(user)
    };

    // Notify friend that the friend request was accepted
    const friendSocketId = req.onlineUsers.get(friendId);

    if (friendSocketId) {
      req.io.to(friendSocketId).emit('friend_request_accepted', notification.data);
    } else {
      // Store notification in the database if the friend is offline
      friend.pendingNotifications.push(notification);
      await friend.save();
    }

    res.json(toUserObject(friend));
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Remove Friend
router.delete('/:userId/remove/:friendId', auth, async (req, res, next) => {
  const {userId, friendId} = req.params;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: 'User not found' });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    const notification = {
      type: 'friend_removed',
      data: toUserObject(user)
    };

    // Notify friend that his friend has removed him
    const friendSocketId = req.onlineUsers.get(friendId);

    if (friendSocketId) {
      req.io.to(friendSocketId).emit('friend_removed', notification.data);
    }

    await user.save();
    await friend.save();

    res.json(toUserObject(friend));
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

export default router;
