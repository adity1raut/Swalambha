import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ConnectDB from './db/ConnectDb.js';

const app = express();
dotenv.config();

ConnectDB();

app.use(express.json());



app.listen (process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});