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
const generateToken = (user) => {
    return jwt.sign({ 
      email: user.Email,
      isAdmin: user.isAdmin 
    }, process.env.JWT_SECRET);
};

const adminMiddleware = (req, res, next) => {
    if (req.user?.isAdmin) return next();
    res.status(403).redirect('/listings');
};

module.exports = {jwtAuthMiddleware, generateToken};