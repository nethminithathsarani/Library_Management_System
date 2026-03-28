import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Unauthorized: missing Bearer token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me-in-env');
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
};
