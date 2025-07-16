import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors';

import connectDB from "./configs/db.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import analyticRouter from "./routes/analytic.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Config env var and database
dotenv.config();
connectDB();

const app = express();

// Permissive CORS for development
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

// Disable Helmet for development debugging
// app.use(helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false
// }));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
    console.log("Running in node development env...".yellow.bold);
};

// Routes
app.get('/', (req, res) => {
    console.log('Root endpoint hit');
    res.json({ message: 'Excel Analytics Backend API is running!', status: 'OK' });
});

app.use("/auth", authRouter);
app.use("/analytics", analyticRouter);
app.use("/admin", adminRoutes);

// Error handling middleware should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log('Environment PORT:', process.env.PORT, 'Using PORT:', PORT);
app.listen(PORT, () => console.log(
    ('Server is running on '.green + `http://localhost:${PORT}`.magenta).bold
));
