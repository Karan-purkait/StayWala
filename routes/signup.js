const express = require("express");
const router = express.Router();
const {get_signup_page,
    post_signup_page} = require("../controller/signup");
router.get("/",get_signup_page);
router.post("/", post_signup_page);
module.exports = router;