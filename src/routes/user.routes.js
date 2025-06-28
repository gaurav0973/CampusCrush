import express from 'express';
import  userAuth  from '../middleware/auth.middleware.js';
import ConnectionRequest from '../models/connectionRequest.model.js';


const userRouter = express.Router();


// get all pending connection request for logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {

        const loggedInUserId = req.user._id;

        const connctionRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId,
            status : "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]);

        if (connctionRequests.length === 0) {
            return res.status(404).json({
                message: "No pending connection requests found"
            });
        }


        return res.status(200).json({
            message: "Pending connection requests fetched successfully",
            data: connctionRequests
        });
        
    } catch (error) {
        res.status(400).json({
            message: "Error while fetching connection requests: " + error.message
        })
    }
})




userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId, status: "accepted" },
                { toUserId: loggedInUserId, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"])
            .populate("toUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]);


        const data = connections.map(row => {
            if( row.fromUserId._id.toString() === loggedInUserId.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });


        return res.status(200).json({
            message: "Connections fetched successfully",
            data: data
        });
        
    } catch (error) {
        res.status(400).json({
            message: "Error while fetching connections: " + error.message
        })
    }
})

export default userRouter;