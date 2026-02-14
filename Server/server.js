import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ConnectDB from './db/ConnectDb.js';
import adminRoutes from './routes/admin.routes.js';
import electionRoutes from './routes/election.routes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

ConnectDB();

app.use('/api/admin', adminRoutes);
app.use('/api/election', electionRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});