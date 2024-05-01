import { Request, Response } from 'express';

// Login user
export const loginUser = (req: Request, res: Response) => {
  res.send('Login user');
};

// Register user
export const registerUser = (req: Request, res: Response) => {
  res.send('Register user');
};
