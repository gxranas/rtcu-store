import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieSession from 'cookie-session';
import passport from 'passport';
import {PassportSetup} from './src/middlewares/Passport.js';
import { UsersRouter } from './src/routes/Users.js';

dotenv.config();
const app = express();

app.use(cookieSession({
    name: "session",
    keys: ["rtcustore"],
    maxAge: 24 * 60 * 60 * 100
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: process.env.LOCAL_HOST,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

app.use(express.json());
app.use("/auth", UsersRouter);

mongoose.connect(process.env.CONNECTION_STRING);

app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port: "+ process.env.PORT);
})