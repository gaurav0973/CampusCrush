import express from "express";  
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config()
const app = express();

const port = 3000;

// app.use("/", adminAuth, (req, res) => {
//     res.send("Hello, Admin!");
// });



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
