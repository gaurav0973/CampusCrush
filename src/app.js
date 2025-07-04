import express from "express";  
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import requestRouter from "./routes/request.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import { initialiseSocket } from "./utils/socket.js";

dotenv.config()
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


// routes
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

const server = createServer(app);
initialiseSocket(server);






// db connection
connectDB()
    .then(()=> {
        console.log("Database connected successfully");
        server.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
        })
    })
    .catch((error)=>{
        console.log("Error while connceting database : ", error.message)

    })
