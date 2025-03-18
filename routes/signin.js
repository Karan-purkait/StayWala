const express=require("express")
const router=express.Router();
const {
    get_signin,
    post_signin} = require("../controller/signin");
router.get("/",get_signin);
router.post("/",post_signin);
module.exports = router;