import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, 'Name is too short'],
    maxLength: [50, 'Name is too long'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters including at least 1 uppercase letter, at least 1 lowercase letter, at least 1 digit and at least 1 special character ',
    ],
  },
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

userSchema.methods.checkPassword = async function (userPassword) {
  const isPasswordCorrect = await bcrypt.compare(userPassword, this.password);
  return isPasswordCorrect;
};

export default model('User', userSchema);
