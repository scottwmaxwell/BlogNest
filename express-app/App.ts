import express from 'express';
import postRoutes from './src/routes/postRoutes';
import userRoutes from './src/routes/userRoutes';
import authRoutes from './src/routes/authRoutes';
import commentRoutes from './src/routes/commentRoutes';

const app = express();

app.use(express.json());

// Routes
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/comments', commentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
