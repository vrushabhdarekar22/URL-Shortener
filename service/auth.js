const jwt = require("jsonwebtoken");
const secret = "Vrushabh$45@22";

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email:user.email,
    },secret);
    /*Create a JWT (JSON Web Token) that is digitally signed using a secret key
This token can be sent to the client for authentication and authorization */
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token,secret);
    } catch (error) {
        return null;
    }
    
}

module.exports ={
    setUser,
    getUser,
}