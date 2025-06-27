import express from 'express';
import { userAuth } from '../middleware/auth.middleware';
import ConnectionRequest from '../models/connectionRequest.model';
import User from '../models/user.model';


const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status

        // only two statuses are allowed: "ignored" and "interested"
        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status. Allowed values are: " + allowedStatus.join(", "));
        }

        // check toUserId is existing user 
        const toUser = await User.findById(toUserId);
        if (!toUser){
            res.json({
                message: "User with the given ID does not exist",
                data: null
            })
        }

        // Check if a connection request already exists between the two users
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingRequest) {
            return res.status(400).send("Connection request already exists");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        })

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + "is " + status + "in "  + toUser.firstName,
            data: data
        })
        
    } catch (error) {
        res.status(400).send("Error while sending request: " + error.message);
    }
})  







export default requestRouter;