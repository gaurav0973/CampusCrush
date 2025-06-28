import express from "express";  
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import requestRouter from "./routes/request.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config()
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


// routes
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)



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
