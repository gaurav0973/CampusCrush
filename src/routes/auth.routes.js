import express from "express";
import { validateSignInData, validateSignUpData } from "../utils/validation.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    // validate the data
    validateSignUpData(req);

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // create a new instance of the user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    console.log("User data received: ", user);

    await user.save();
    res.status(201).json({
        message: "User created successfully",
    })
  } catch (error) {
    res.status(400).json({
      message: "Error while creating user: " + error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    // validate the data
    validateSignInData(req);

    // find the user by email
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    }

    // compare the password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "Invalid password",
      });
    }

    //create a jwt token
    const token = await user.getJWT();

    // add the token to cookies and send the responce back to user
    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Login Successful",
      data: {
        userId: user._id,
        emailId: user.emailId,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Error while logging in: " + error.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    // clear the token from cookies
    res.clearCookie("token");

    // send the response back to user
    res.json({
      message: "Logout Successful",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error while logging out: " + error.message,
    });
  }
});

export default authRouter;
