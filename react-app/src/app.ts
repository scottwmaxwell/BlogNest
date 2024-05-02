import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import postsRouter from './posts/posts.routes';
import logger from './services/logger';
import ejs from 'ejs';

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();


app.use(express.json());                        // Parse JSON bodies
app.use(express.urlencoded({ extended: true})); // Parse URL-Encoded bodies
app.use(cors());                                // allows cross-origin
app.use(helmet());                              // helps secure app by setting HTTP response headers

// Set EJS as the view engine
app.set('view engine', 'ejs');


// Specify the directory where your views/templates are located
app.set('views', __dirname + '/views');

// Routers
app.use('/', [postsRouter]);

app.get("/", (req: Request, res: Response)=>{
    logger.info("Documentation page requested")
    res.json({"Message":"Healthy"});
});

app.listen(port, ()=>{
    logger.info(`Listening on port:${port}`)
});