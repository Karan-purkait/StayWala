// Middleware for validation
const { listingSchema, reviewSchema } = require("../schema");
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
module.exports={
    validateListing,
    validateReview
}