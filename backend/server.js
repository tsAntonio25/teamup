import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import githubRoutes from "./routes/githubRoutes.js";
import authRoutes from "./routes/authRoutes.js";


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

app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);


// Server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}); 
