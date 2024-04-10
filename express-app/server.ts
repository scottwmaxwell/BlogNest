import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const mongoURI = process.env.MONGO_URI;

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret';

app.use(bodyParser.json());
app.use(cors());    // allows cross-origin

// Define user type for Request object
declare global {
    namespace Express {
        interface Request {
            user?: { username: string };
        }
    }
}

// Change connection info in .env file at the root of the express-app directory
mongoose.connect(mongoURI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as any)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));


const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
});

interface Post extends mongoose.Document {
    title: string;
    content: string;
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
        req.user = decoded as { username: string }; // Casting decoded as { username: string }
        next();
    });
};

// API routes

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
app.post('/api/posts', authenticateUser, async (req: Request, res: Response) => {
    const author = req.user?.username; // Optional chaining here

    if (!author) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        author: author // Using the retrieved author here
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});


// Update a blog post
app.put('/api/posts/:id', authenticateUser, async (req: Request, res: Response) => {
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
app.delete('/api/posts/:id', authenticateUser, async (req: Request, res: Response) => {
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


// User registration
app.post('/api/register', async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// User login
app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));