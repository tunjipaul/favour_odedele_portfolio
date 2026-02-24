import jwt from 'jsonwebtoken';

// This middleware runs BEFORE any protected route handler.
// It checks: does this request have a valid JWT token?
const protect = (req, res, next) => {
  // 1. Get the token from the Authorization header
  //    Frontend sends: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract just the token part

  try {
    // 2. Verify the token using our secret key
    //    If the token is expired or tampered with, jwt.verify() throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the decoded admin info to the request object
    //    Now any route handler can access req.admin to know who made the request
    req.admin = decoded;

    // 4. Call next() to pass control to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized — token is invalid or expired' });
  }
};

export default protect;
