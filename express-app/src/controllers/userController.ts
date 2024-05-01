import { Request, Response } from 'express';
import User from '../models/userModel';

// Get all users
export const getAllUsers = (req: Request, res: Response) => {
  res.send('Get all users');
};

// Get user by ID
export const getUserById = (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send(`Get user with ID ${userId}`);
};

// Create a new user
export const createUser = (req: Request, res: Response) => {
  res.send('Create a new user');
};

// Update a user
export const updateUser = (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send(`Update user with ID ${userId}`);
};

// Delete a user
export const deleteUser = (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send(`Delete user with ID ${userId}`);
};
