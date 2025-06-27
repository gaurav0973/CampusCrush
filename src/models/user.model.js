import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
    },
    lastName : {
        type : String,
        trim : true,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid");
            }
        }
    },
    password : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        min : 16,
    },
    gender : {
        type : String,
        validate(value){
            if(["male", "female"].includes(value) === false){
                throw new Error("Gender Data is not valid");
            }
        },
    },
    photoUrl : {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid");
            }
        }

    },
    about : {
        type : String,
    },
    skills : {
        type : [String],
    },

},
{
    timestamps: true,
});



// use this when the methods are closely related to userSchema
userSchema.methods.getJWT = async function () {
    const user = this;
    const token =  await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '1d'
    });
    return token;
}

userSchema.methods.validatePassword = async function (passwordEnteredByUser){
    const user = this;
    const passwordHashInDB = user.password;
    const isPasswordValid = await bcrypt.compare(passwordEnteredByUser, passwordHashInDB);
    
    return isPasswordValid;
}



const User = mongoose.model('User', userSchema);
export default User;