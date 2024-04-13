import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors';
import jslog from 'jslog';
import fs from 'fs';

dotenv.config();
const mongoURI = process.env.MONGO_URI;

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'your_jwt_secret';

app.use(bodyParser.json());
app.use(cors());    // allows cross-origin

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Initialize logger with ConsoleAppender and FileAppender
const logger = jslog.configure({
    level: 'info',
    format: '[:date] [:level] :message',
    appenders: [
        new jslog.appenders.ConsoleAppender(),
        new jslog.appenders.FileAppender('./logs/app.log') // Logging to a file in logs directory
    ]
});

// MongoDB Connection
mongoose.connect(mongoURI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as any)
.then(() => logger.info('MongoDB Connected'))
.catch(err => logger.error('MongoDB Connection Error:', err));

// Define user type for Request object
declare global {
    namespace Express {
        interface Request {
            user?: { username: string };
        }
    }
}

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

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

interface User extends mongoose.Document {
    username: string;
    password: string;
}

const UserModel = mongoose.model<User>('User', userSchema);

// Middleware for user authentication
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded as { username: string };
        next();
    });
};

// API routes

// Get all blog posts
app.get('/api/posts', async (req: Request, res: Response) => {
    logger.info('GET /api/posts');
    try {
        const posts = await PostModel.find();
        logger.info('Retrieved all blog posts');
        res.json(posts);
    } catch (err: any) {
        logger.error('Error getting posts:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get a single blog post by id
app.get('/api/posts/:id', async (req: Request, res: Response) => {
    logger.info(`GET /api/posts/${req.params.id}`);
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            logger.error('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }
        logger.info(`Retrieved post with id ${req.params.id}`);
        res.json(post);
    } catch (err: any) {
        logger.error('Error getting post:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get a single blog post by author username
app.get('/api/posts/author/:author', async (req: Request, res: Response) => {
    logger.info(`GET /api/posts/author/${req.params.author}`);
    try {
        const post = await PostModel.find({ "author": req.params.author });
        if (!post) {
            logger.error('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }
        logger.info(`Retrieved posts by author ${req.params.author}`);
        res.json(post);
    } catch (err: any) {
        logger.error('Error getting posts by author:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create a new blog post
app.post('/api/posts', async (req: Request, res: Response) => {
    logger.info('POST /api/posts');
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
        imageURL: req.body.imageURL,
        author: req.body.author
    });

    try {
        const newPost = await post.save();
        logger.info('New post created');
        res.status(201).json(newPost);
    } catch (err: any) {
        logger.error('Error creating post:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update a blog post
app.put('/api/posts/:id', async (req: Request, res: Response) => {
    logger.info(`PUT /api/posts/${req.params.id}`);
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            logger.error('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }
        post.title = req.body.title;
        post.content = req.body.content;
        const updatedPost = await post.save();
        logger.info(`Post with id ${req.params.id} updated`);
        res.json(updatedPost);
    } catch (err: any) {
        logger.error('Error updating post:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a blog post
app.delete('/api/posts/:id', async (req: Request, res: Response) => {
    logger.info(`DELETE /api/posts/${req.params.id}`);
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            logger.error('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }
        await PostModel.deleteOne({ _id: req.params.id });
        logger.info(`Post with id ${req.params.id} deleted`);
        res.json({ message: 'Post deleted successfully' });
    } catch (err: any) {
        logger.error('Error deleting post:', err);
        res.status(500).json({ message: err.message });
    }
});

// User registration
app.post('/api/register', async (req: Request, res: Response) => {
    logger.info('POST /api/register');
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        logger.info('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: any) {
        logger.error('Error registering user:', err);
        res.status(400).json({ message: err.message });
    }
});

// User login
app.post('/api/login', async (req: Request, res: Response) => {
    logger.info('POST /api/login');
    try {
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) {
            logger.error('Invalid username or password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            logger.error('Invalid username or password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        logger.info('User logged in successfully');
        res.json({ token });
    } catch (err: any) {
        logger.error('Error logging in user:', err);
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
