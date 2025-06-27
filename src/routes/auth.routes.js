import express from 'express';
import { validateSignInData, validateSignUpData } from '../utils/validation.js';
import User from '../models/user.model.js';

const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {

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



authRouter.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    try {
        
        // validate the data
        validateSignInData(req)

        // find the user by email
        const user = await User.findOne({emailId : emailId})
        if(!user) {
            throw new Error("User not found");
        }

        // compare the password
        const isPasswordValid = user.validatePassword(password)
        if(!isPasswordValid){
            throw new Error("Invalid password");
        }

        //create a jwt token
        const token = user.getJWT()

        // add the token to cookies and send the responce back to user
        res.cookie("token", token, {
            httpOnly: true
        })

        return res.send("Login Successful");
        
    } catch (error) {
        res.status(400).send("Error while logging in: " + error.message);
    }
})


authRouter.post("/logout", async (req, res) => {
    try {
        // clear the token from cookies
        res.clearCookie("token");

        // send the response back to user
        res.send("Logout Successful");
        
    } catch (error) {
        res.status(400).send("Error while logging out: " + error.message);
    }
})



export default authRouter;