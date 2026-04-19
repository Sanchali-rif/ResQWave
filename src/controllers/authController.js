import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signupSchema, signinSchema } from '../utils/authValidators.js';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export const signup = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    const { name = '', email, password } = data;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(201).json({ message: 'User created', data: { id: user._id, email: user.email, name: user.name }, token });
  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation Error', details: error.errors });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const signin = async (req, res) => {
  try {
    const data = signinSchema.parse(req.body);
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(200).json({ message: 'Authenticated', data: { id: user._id, email: user.email, name: user.name }, token });
  } catch (error) {
    logger.error(`Signin error: ${error.message}`);
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation Error', details: error.errors });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
