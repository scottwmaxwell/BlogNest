import { Request, Response } from 'express';
import Post from '../models/postModel';

// Get all posts
export const getAllPosts = (req: Request, res: Response) => {
  res.send('Get all posts');
};

// Get post by ID
export const getPostById = (req: Request, res: Response) => {
  const postId = req.params.id;
  res.send(`Get post with ID ${postId}`);
};

// Create a new post
export const createPost = (req: Request, res: Response) => {
  res.send('Create a new post');
};

// Update a post
export const updatePost = (req: Request, res: Response) => {
  const postId = req.params.id;
  res.send(`Update post with ID ${postId}`);
};

// Delete a post
export const deletePost = (req: Request, res: Response) => {
  const postId = req.params.id;
  res.send(`Delete post with ID ${postId}`);
};
