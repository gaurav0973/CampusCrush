import validator from 'validator';

export const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and last name are required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be strong");
    }
}

export const validateSignInData = (req) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new Error("Email and password are required");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be strong");
    }
}