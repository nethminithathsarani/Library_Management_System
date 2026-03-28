export const allowRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized: user context missing' });
    return;
  }

  if (!allowedRoles.includes(req.user.role)) {
    res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    return;
  }

  next();
};
