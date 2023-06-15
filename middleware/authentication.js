import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/index.js';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthorizedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { userId, name } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId, name };
    next();
  } catch (error) {
    throw new UnauthorizedError('Authentication invalid');
  }
};

export default authenticateUser;
