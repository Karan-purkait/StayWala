// Middleware for validation
const { listingSchema, reviewSchema } = require("../schema");
const ExpressError=require("../util/ExpressError")
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(", ");
      next(new ExpressError(400, errMsg));
    } else {
      next();
    }
};
  
const validateReview = (req, res, next) => {
const { error } = reviewSchema.validate(req.body);
if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    next(new ExpressError(400, errMsg));
} else {
    next();
}
};
const make_image_object = (req, res, next) => {
  if (!req.body.listing) {
      return next(new ExpressError(400, "Listing data is missing"));
  }

  let { listing } = req.body;

  if (!listing.image || typeof listing.image === "string") {
      listing.image = {
          filename: "listingimage",
          url: listing.image || "",
      };
  }

  next();
};
module.exports={
    validateListing,
    validateReview,
    make_image_object
}