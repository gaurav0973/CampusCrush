import express from "express";
import userAuth from "../middleware/auth.middleware.js";
import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // only two statuses are allowed: "ignored" and "interested"
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({
            message: "Invalid status. Allowed values are: " + allowedStatus.join(", ")
          })
      }

      // check toUserId is existing user
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.json({
          message: "User with the given ID does not exist",
          data: null,
        });
      }

      // Check if a connection request already exists between the two users
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400)
          .json({
            message: "Connection request already exists between these users"
          });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent successfully",
        data: data,
      });
    } catch (error) {
      res.status(400)
        .json({ message: "Error while sending request: " + error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400)
          .json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      return res.status(200)
        .json({
          message: "Connection request " + status,
          data: data,
        })

    } catch (err) {
      res.status(400)
        .json({
          message: "Error while reviewing connection request: " + err.message
        })
    }
  }
);

export default requestRouter;
