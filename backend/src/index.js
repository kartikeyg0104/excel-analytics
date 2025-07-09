import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors';

import connectDB from "./configs/db.js";
import errorHandler from "./middlewares/error.middleware.js";

// Config env var and database
dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
    console.log("Running in node development env...".yellow.bold);
};

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(
    ('Server is running on '.green + `http://localhost:${PORT}`.magenta).bold
));
