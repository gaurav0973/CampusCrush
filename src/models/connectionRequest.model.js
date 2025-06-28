import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User" // reference to User model
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User" // reference to User model
    },
    status : {
        type : String,
        enum : {
            values : ["ignored", "interested",  "accepted", "rejected"],
            message : "Status must be one of the following: ignored, interested, accepted, rejected" 
        },
        required : true
        
    },

}, {
    timestamps : true
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this

    // check if fromUserId and toUserId are not the same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send a connection request to yourself");
    }
    next()
})


const ConnectionRequestModel =  mongoose.model("ConnectionRequest", connectionRequestSchema);
export default ConnectionRequestModel;

