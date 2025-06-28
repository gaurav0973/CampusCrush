import express from 'express';
import  userAuth  from '../middleware/auth.middleware.js';
import ConnectionRequest from '../models/connectionRequest.model.js';
import User from '../models/user.model.js';


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


/*
user should see all the cards except
1. his own card
2. his connections
3. ignored people
4. already sent connection requests
*/
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        // get all conncetion requests (sent + recieved)
        const conncetionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")


        const hideUserFromFeed = new Set()
        conncetionRequests.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })


        const user = await User.find({
           $and: [
               { _id: { $nin: Array.from(hideUserFromFeed) } },
               { _id: { $ne: loggedInUser._id } },
               
           ]
        }).select(["firstName", "lastName", "photoUrl", "about", "skills"])
        
    } catch (error) {
        res.status(400).json({
            message: "Error while fetching user feed: " + error.message
        })
        
    }
})

export default userRouter;