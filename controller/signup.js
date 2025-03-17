const User = require("../models/user");
async function get_signup_page(req,res){
    const error = req.session.error || null;
    delete req.session.error;
    res.render("signup", { error });
}
async function post_signup_page(req,res){
    const { name, email, password, confirm_Password } = req.body;
    try {
        const existingUser = await User.findOne({ Email: email });

        if (existingUser) {
            req.session.error = "User already exists! Try logging in...";
            return res.redirect("/signup");
        }


        if (password !== confirm_Password) {
            req.session.error = "Passwords do not match. Please try again.";
            return res.redirect("/signup");
        }

        await User.create({Name:name, Email: email, Password: password });
          // Set secure cookie with email
        /*res.cookie("userEmail", email, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });*/



        res.redirect("/listings"); 
    } catch (err) {
        console.error("Error:", err);
        req.session.error = "An error occurred while creating your account. Please try again.";
        res.redirect("/signup");
    }
}
module.exports={
    get_signup_page,
    post_signup_page
}