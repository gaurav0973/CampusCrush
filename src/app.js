import express from "express";  
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/user.model.js";
import { validateSignInData, validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken";
import { userAuth } from "./middleware/auth.middleware.js";

dotenv.config()
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// user signup
app.post("/signup", async (req, res) => {

    const {firstName, lastName, emailId, password} = req.body;
    try {
    // validate the data 
    validateSignUpData(req);

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // create a new instance of the user
    const user = new User({firstName, lastName, emailId, password: passwordHash})
    console.log("User data received: ", user);
    
    await user.save();
    res.status(201).send("User created successfully");
    } catch (error) {
        res.status(400).send("Error while creating user: " + error.message);
    }
})


// user login
app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    try {
        
        // validate the data
        validateSignInData(req)

        // find the user by email
        const user = await User.findone({emailId : emailId})
        if(!user) {
            throw new Error("User not found");
        }

        // compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid password");
        }

        //create a jwt token
        const token = jwt.sign({ _id: user._id },
                                process.env.JWT_SECRET, 
                                { expiresIn:process.env.JWT_EXPIRY || '1h' });

        // add the token to cookies and send the responce back to user
        res.cookie("token", token, {
            httpOnly: true
        })

        return res.send("Login Successful");
        
    } catch (error) {
        res.status(400).send("Error while logging in: " + error.message);
    }
})

// user profile
app.get("/profile", userAuth, async (req, res) => {
    try {
        // get the user
        const user = req.user
        
        // send the user data back to the client
        res.status(200).send(user)

    } catch (error) {
        res.status(400).send("Error while fetching profile: " + error.message);
    }
})

// get user by email
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
app.patch("/user/:userId", async(req, res)=>{

    const { userId } = req.params
    console.log("User ID to update: ", userId);
    try {

        const ALLOWED_UPDATES = ["userId",  "photoUrl", "about", "lastName"]
        const isUpdateAllowed = Object.keys(req.body).every((update) => ALLOWED_UPDATES.includes(update));
        if (!isUpdateAllowed) {
            throw new Error("Invalid update fields");
        }
        const user = await User.findOneAndUpdate({ _id: userId }, req.body);
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
