const express = require("express");
const { validateListing,
    validateReview,
    make_image_object } = require("../middleware/middleware");
const {jwtAuthMiddleware}=require("../auth")
const app = express.Router();
const { gethomepage,
    get_listings,
    get_listings_new,
    find_list_by_id,
    post_listing,
    edit_list_by_id,
    put_listings_id,
    delete_list_by_id,
    post_review,
    user_logout,
    } = require("../controller/user");
// Routes
app.get("/",gethomepage);
app.get("/listings",jwtAuthMiddleware,get_listings );
app.get("/listings/new",jwtAuthMiddleware,get_listings_new );
app.get("/listings/:id", jwtAuthMiddleware,find_list_by_id);
app.post("/listings",jwtAuthMiddleware,make_image_object, validateListing, post_listing);
//app.post("/listings",post_listing);
app.get("/listings/:id/edit",jwtAuthMiddleware,edit_list_by_id);
app.put("/listings/:id",jwtAuthMiddleware,make_image_object, validateListing,put_listings_id );
app.delete("/listings/:id",jwtAuthMiddleware,delete_list_by_id);
app.post("/listings/:id/reviews",jwtAuthMiddleware, validateReview,post_review );
app.get("/logout",jwtAuthMiddleware,user_logout )
module.exports=app;

