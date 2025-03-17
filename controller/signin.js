const User = require("../models/user");
async function get_signin(req,res){
    const error = req.session.error; 
    req.session.error = null; 
    res.render("signin", { error }); 
}
async function post_signin(req,res){
    const body=req.body;
    const user_by_mail=await User.findOne({ Email: body.email });
    if(!user_by_mail){
        req.session.error = "Invalid username or password!";
        res.redirect('/signin');
    }
    else if(user_by_mail.Password==body.password){
        /*res.cookie("userEmail", body.email, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });*/
        res.redirect('/listings');
        
    }else{
        req.session.error = "Invalid username or password!";
        res.redirect('/signin');
    }
}
module.exports={
    get_signin,
    post_signin
}