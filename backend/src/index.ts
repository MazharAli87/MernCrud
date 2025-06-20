import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import posts from './routes/posts'
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json())

connectDB();

app.use('/api/posts', posts);

app.listen(PORT, ()=> {
    console.log("Server is running");
})