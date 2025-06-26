import express from "express";  
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/user.model.js";

dotenv.config()
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// user signup
app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    console.log("User data received: ", user);
    try {
        await user.save();
        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(400).send("Error while creating user: " + error.message);
    }
})


// get user by emai
app.get("/user" , async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).send("Error while fetching user: " + error.message);
    }
})

// get all user : feed API
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).send("Error while fetching all user: " + error.message);
    }
})

// delete user from database
app.delete("/user", async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ emailId: req.body.emailId });
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.status(200).send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Error while deleting user: " + error.message);
    }
})

// update the user 
app.patch("/user", async(req, res)=>{
    try {
        const user = await User.findOneAndUpdate({ emailId: req.body.emailId }, req.body);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).send("Error while updating user: " + error.message);
    }
})



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
