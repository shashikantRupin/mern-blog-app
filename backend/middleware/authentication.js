const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader) {
    token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;
  }

  if (!token) {
    return res.status(401).json({ message: 'Login first', auth: false });
  }

  const secretKey = process.env.JWT_SECRET || 'secret';
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token', auth: false });
    }
    req.headers.userId = decoded.userId;
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { authentication, autentication: authentication };
