
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError=require("../util/ExpressError")
const blockchainClient = require('../blockchain/client');
async function gethomepage(req,res){
    //res.send("Welcome to Wanderlust!");
    res.render("listings/home");
}
async function get_listings(req,res,next){
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
}
async function get_listings_new(req,res){
    res.render("listings/new");
}
async function find_list_by_id(req,res,next){
    try {
        const listing = await Listing.findById(req.params.id).populate("reviews");
        if (!listing) throw new ExpressError(404, "Listing not found");
        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
}
/*async function post_listing(req,res,next){
    try {
        const newListing = {
        ...req.body.listing,
        image: req.body.listing.image || { filename: "", url: "" },
        };
        const listing = new Listing(newListing);
        await listing.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}*/
async function post_listing(req, res, next) {
    try {
        let { listing } = req.body;
        const newListing = new Listing(listing);
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}
async function edit_list_by_id(req,res,next){
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) throw new ExpressError(404, "Listing not found");
        res.render("listings/edit", { listing });
    } catch (err) {
        next(err);
    }
}
/*async function put_listings_id(req,res,next){
    try {
        const updatedListing = {
        ...req.body.listing,
        image: req.body.listing.image || { filename: "", url: "" },
        };
        await Listing.findByIdAndUpdate(req.params.id, updatedListing, { new: true });
        res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
        next(err);
    }
}*/
async function put_listings_id(req, res, next) {
    try {
        let { listing } = req.body;
        // Ensure image is always an object
        if (!listing.image || typeof listing.image === "string") {
            listing.image = { filename: "", url: listing.image || "" };
        }
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $set: listing }, // Using $set to ensure only provided fields are updated
            { new: true, runValidators: true }
        );
        res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
        next(err);
    }
}

async function delete_list_by_id(req,res,next){
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}
async function post_review(req,res,next){
    try {
        const reviewData = {
            id: uuidv4(),
            listingId: req.params.id,
            rating: req.body.review.rating,
            comment: req.body.review.comment,
            author: req.user.email,
            timestamp: Date.now()
        };
        await blockchainClient.submitReview(req.user.email, reviewData);
        const listing = await Listing.findById(req.params.id);
        if (!listing) throw new ExpressError(404, "Listing not found");
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        next(new ExpressError(500, "Blockchain submission failed"));
    }
}
async function user_logout(req,res){
    res.clearCookie("auth_token");
    return res.redirect("/");
}
module.exports={
    gethomepage,
    get_listings,
    get_listings_new,
    find_list_by_id,
    post_listing,
    edit_list_by_id,
    put_listings_id,
    delete_list_by_id,
    post_review,
    user_logout,
}