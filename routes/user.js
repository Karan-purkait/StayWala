const express = require("express");
const { validateListing,
    validateReview } = require("../middleware/middleware");
const app = express.Router();
const { gethomepage,
    get_listings,
    get_listings_new,
    find_list_by_id,
    post_listing,
    edit_list_by_id,
    put_listings_id,
    delete_list_by_id,
    post_review } = require("../controller/user");
// Routes
app.get("/",gethomepage);
app.get("/listings",get_listings );
app.get("/listings/new",get_listings_new );
app.get("/listings/:id", find_list_by_id);
app.post("/listings", validateListing, post_listing);
app.get("/listings/:id/edit",edit_list_by_id);
app.put("/listings/:id", validateListing,put_listings_id );
app.delete("/listings/:id",delete_list_by_id);
app.post("/listings/:id/reviews", validateReview,post_review );
module.exports=app;

