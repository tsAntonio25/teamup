import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('TeamUP! Backend is running');
});

// Server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}); 
