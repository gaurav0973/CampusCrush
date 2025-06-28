import express from "express";
import userAuth from "../middleware/auth.middleware.js";
import { validateProfileData } from "../utils/validation.js";

const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        // get the user
        const user = req.user
        
        // send the user data back to the client
        res.status(200).json({
            message: "User profile fetched successfully",
            data: user
        })

    } catch (error) {
        res.status(400).json({
            message: "Error while fetching profile: " + error.message
        });
    }
})


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {

        // validate the data
        if(!validateProfileData(req)){
            throw new Error("Invalid profile data");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach( key => loggedInUser[key] = req.body[key])

        await loggedInUser.save();
        res.status(200).send("Profile updated successfully");
    } catch (error) {
        res.status(400).send("Error while updating profile: " + error.message);
        
    }
})


// This route is for changing the password of the user
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // validate the data
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            })
        }

        const loggedInUser = req.user;

        // check if the current password is correct
        const isPasswordValid = loggedInUser.validatePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Current password is incorrect"
            })
        }

        // update the password
        loggedInUser.password = newPassword;
        await loggedInUser.save();

        res.status(200).json({
            message: "Password changed successfully"
        })
    } catch (error) {
        res.status(400).json({
            message: "Error while changing password: " + error.message
        });
    }
})


export default profileRouter;