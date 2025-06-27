import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const userAuth = async (req, res, next) => {
    
    // read the token from cookies
    const { token } = req.cookies;

    try {
        if (!token)     {
            throw new Error("Authentication token is missing");
        }

        // validate the token
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedMessage;
        if (!_id) {
            throw new Error("Invalid token");
        }

        // find the user
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(400).send("Error in middleware: " + error.message);
    }

}