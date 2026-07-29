export const requireAuth = (req, res, next) => {
  // Simple session check middleware stub
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized. Access denied.' });
  }
  next();
};
