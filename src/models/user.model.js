import mongoose from 'mongoose';

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

const User = mongoose.model('User', userSchema);
export default User;