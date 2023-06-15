import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthorizedError } from '../errors/index.js';

export const register = async (req, res) => {
  const { confirmPassword, ...userData } = req.body;
  if (!confirmPassword) {
    throw new BadRequestError('Please confirm password');
  }

  if (userData.password !== confirmPassword)
    throw new BadRequestError("Passwords don't match.");

  const user = await User.create(userData);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    statusCode: StatusCodes.CREATED,
    message: 'User Created',
    user: { user: user.name },
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: `${user.name} logged in`,
    user: { user: user.name },
    token,
  });
};
