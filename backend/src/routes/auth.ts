import { Express, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken } from '../middleware/auth.js';

export function registerAuthRoutes(app: Express) {
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { email, password, name } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    const token = signToken({ userId: String(user._id), email });
    res.json({ token });
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ userId: String(user._id), email });
    res.json({ token });
  });
}


