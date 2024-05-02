// import executeMongoDBOperation from '../services/mongodb.connector'
import { Request, RequestHandler, Response} from 'express';
const {ObjectId } = require('mongodb');
import logger from '../services/logger';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Change connection info in .env file at the root of the express-app directory
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as any)
.then(() => logger.info('MongoDB Connected'))
.catch(err => logger.error('MongoDB Connection Error: ', err));

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    description: String,
    imageURL: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
});

interface Post extends mongoose.Document {
    title: string;
    content: string;
    description: string;
    imageURL: string;
    author: string;
    createdAt: Date;
}

const PostModel = mongoose.model<Post>('Post', postSchema);

// Get all posts
export const getPosts: RequestHandler = async(req: Request, res: Response)=>{
    try {
        const posts = await PostModel.find();
        res.json(posts);
        logger.info(`${req.method} ${req.url} - Retrieved posts`)
    } catch (err:any) {
        res.status(500).json({ message: err.message });
        logger.error("Could not get posts: " + err.message);
    }
}

// Get posts by Id
export const getPostById:RequestHandler = async(req: Request, res: Response)=>{
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            logger.error(`${req.method} ${req.url} - Could not find post with id of ${req.params.id}`);
            return res.status(404).json({ message: 'Post not found' });
        }

        logger.info(`${req.method} ${req.url} - Retrieved post with id ${req.params.id}`);
        res.json(post);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
        logger.error(`Could not get post with id of ${req.params.id}:${err.message}`);
    }
}

export const getPostByAuthor:RequestHandler = async(req: Request, res: Response)=>{
    try {
        const post = await PostModel.find({"author":req.params.author});
        if (!post) {
            logger.error(`${req.method} ${req.url} - Could not retrieve post with author of ${req.params.author}`);
            return res.status(404).json({ message: 'Post not found' });
        }

        logger.info(`${req.method} ${req.url} - Retrieved post(s) with author of ${req.params.author}`);
        res.json(post);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
        logger.error(`Could not get post with author of ${req.params.author}:${err.message}`);
    }
}

// Create a post
export const createPost:RequestHandler = async(req: Request, res: Response)=>{
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
        imageURL: req.body.imageURL,
        author: req.body.author 
        // author: author // Using the retrieved author here
    });

    try {
        const newPost = await post.save();
        logger.info(`${req.method} ${req.url} - Created a post`)
        res.status(201).json(newPost);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
        logger.error(`Could not create post:${err.message}`);
    }
}

// Update a post
export const updatePost:RequestHandler = async(req: Request, res: Response)=>{
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.title = req.body.title;
        post.content = req.body.content;
        const updatedPost = await post.save();
        logger.info(`${req.method} ${req.url} - Updated post with id of ${req.params.id}`);
        res.json(updatedPost);
    } catch (err:any) {
        res.status(400).json({ message: err.message });
        logger.error(`Could not update post:${err.message}`);
    }
}

// Delete a post
export const deletePost:RequestHandler = async(req: Request, res: Response)=>{
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await PostModel.deleteOne({ _id: req.params.id });
        logger.info(`${req.method} ${req.url} - Deleted post with id of ${req.params.id}`);
        res.json({ message: 'Post deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
        logger.error(`Could not delete post:${err.message}`);
    }
}