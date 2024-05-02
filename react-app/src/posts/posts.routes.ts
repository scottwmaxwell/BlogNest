import { Router } from 'express';
import * as postsController from './posts.controller';
import { Request, RequestHandler, Response} from 'express';

const router = Router();

// API routes
router.get('/api/posts', postsController.getPosts);
router.get('/api/posts/:id', postsController.getPostById);
router.get("/api/posts/author/:author", postsController.getPostByAuthor);
router.post('/api/posts', postsController.createPost);
router.put('/api/posts/:id', postsController.updatePost);
router.delete('/api/posts/:id', postsController.deletePost);

export default router;