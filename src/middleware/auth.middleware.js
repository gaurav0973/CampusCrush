import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userAuth = async (req, res, next) => {
  // read the token from cookies
  const token = req.cookies.token

  try {
    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing. Please log in again.",
      });
    }

    // validate the token
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;
    if (!_id) {
      return res.status(401).json({
        message: "Invalid authentication token. Please log in again.",
      });
    }

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Error while authenticating user: " + error.message,
    });
  }
};

export default userAuth;
