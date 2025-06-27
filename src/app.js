import express from "express";  
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser"

dotenv.config()
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())






// db connection
connectDB()
    .then(()=> {
        console.log("Database connected successfully");
        app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
        })
    })
    .catch((error)=>{
        console.log("Error while connceting database : ", error.message)

    })
