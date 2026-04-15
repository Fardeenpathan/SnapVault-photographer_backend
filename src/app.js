import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/payment.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express ();

app.use(cors({
 origin: "http://localhost:3000",
 methods:["GET", "POST"],
 credentials: true,
}));

app.use(express.json());

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/payment", subscriptionRouter);



export default app;