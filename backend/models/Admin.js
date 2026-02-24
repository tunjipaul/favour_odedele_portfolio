import mongoose from 'mongoose';

// Single admin user — Favour's login account
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Stored as bcrypt hash — NEVER plain text
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
