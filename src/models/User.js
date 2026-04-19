import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['responder', 'admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;
