import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors';
import { Logger } from 'tslog';

dotenv.config();
const mongoURI = process.env.MONGO_URI;

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors()); // allows cross-origin

// Define log structure
interface MyLogObj {
    message: string;
    level: string;
    timestamp: string;
}

// Initialize tslog logger with custom log structure
const logger: Logger<MyLogObj> = new Logger();

// Change connection info in .env file at the root of the express-app directory
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

// Middleware for logging requests
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`); // Log request method and URL
    next();
});

// API routes
app.get("/", async(req: Request, res: Response) => {
    res.status(200).json({ message: "Healthy"});
});

// Get all blog posts
app.get('/api/posts', async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find();
        res.json(posts);
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single blog post by id
app.get('/api/posts/:id', async (req: Request, res: Response) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single blog post by author username
app.get('/api/posts/author/:author', async (req: Request, res: Response) => {
    try {
        const post = await PostModel.find({"author":req.params.author});
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new blog post
app.post('/api/posts', async (req: Request, res: Response) => {
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
        res.status(201).json(newPost);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Update a blog post
app.put('/api/posts/:id', async (req: Request, res: Response) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.title = req.body.title;
        post.content = req.body.content;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err:any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a blog post
app.delete('/api/posts/:id', async (req: Request, res: Response) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await PostModel.deleteOne({ _id: req.params.id });
        res.json({ message: 'Post deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
