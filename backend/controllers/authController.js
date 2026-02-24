import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// POST /api/auth/login
// Checks email + password, returns a JWT if valid
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare the submitted password against the stored bcrypt hash
    //    bcrypt.compare() is async — it hashes the input and compares
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Generate JWT — sign a payload with our secret key
    //    { id: admin._id } is the payload embedded in the token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token, // Frontend stores this in localStorage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
