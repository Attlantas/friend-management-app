import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pendingNotifications: [
    {
      type: { type: String },
      data: { type: Object },
    },
  ],
  online: { type: Boolean, default: false }
});

export default mongoose.model("User", UserSchema);

