const User = require("../models/user");
const {generateToken} = require('./../auth');
async function get_signin(req,res){
    const error = req.session.error; 
    req.session.error = null; 
    return res.render("signin", { error }); 
}
async function post_signin(req,res){
    const body=req.body;
    const user_by_mail=await User.findOne({ Email: body.email });
    if(!user_by_mail){
        req.session.error = "Invalid username or password!";
        return res.redirect('/signin');
    }
    else if(user_by_mail.Password==body.password  &&  body.remember_me){
        const payload=body.email;
        const token = generateToken(payload);
        res.cookie("auth_token", token, 
            { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production'? true : false, 
                sameSite: "Strict" ,
                maxAge: 1000 * 60 * 60 * 24 * 30 //for 30 days
            });
        return res.redirect('/listings');
        
    }else if(user_by_mail.Password==body.password  &&  !(body.remember_me)){
        const payload=body.email;
        const token = generateToken(payload);
        res.cookie("auth_token", token, 
            { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production'? true : false, 
                sameSite: "Strict" ,
                maxAge: 1000 * 60 * 60 * 24 // for 1 day only
            });
        return res.redirect('/listings');
    }
    else{
        req.session.error = "Invalid username or password!";
        return res.redirect('/signin');
    }
}
module.exports={
    get_signin,
    post_signin
}