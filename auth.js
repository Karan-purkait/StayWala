const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtAuthMiddleware = (req, res, next) => {
    const token = req.cookies?.auth_token;
    if(!token) return res.redirect("/signin");
    try{
        // Verify the JWT token
        const secretkey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretkey);
        // Attach user information to the request object
        req.user = decoded
        next();
    }catch(err){
        return res.redirect("/signin");
    }
}
// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    const secretkey="apertre2.0"
    return jwt.sign(userData,secretkey);
}

module.exports = {jwtAuthMiddleware, generateToken};