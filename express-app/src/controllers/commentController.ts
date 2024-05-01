import { Request, Response } from 'express';
import Comment from '../models/commentModel';

// Get all comments
export const getAllComments = (req: Request, res: Response) => {
  res.send('Get all comments');
};

// Get comment by ID
export const getCommentById = (req: Request, res: Response) => {
  const commentId = req.params.id;
  res.send(`Get comment with ID ${commentId}`);
};

// Create a new comment
export const createComment = (req: Request, res: Response) => {
  res.send('Create a new comment');
};

// Update a comment
export const updateComment = (req: Request, res: Response) => {
  const commentId = req.params.id;
  res.send(`Update comment with ID ${commentId}`);
};

// Delete a comment
export const deleteComment = (req: Request, res: Response) => {
  const commentId = req.params.id;
  res.send(`Delete comment with ID ${commentId}`);
};
