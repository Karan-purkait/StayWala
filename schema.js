const Joi = require("joi");

// Define the validation schema for a "listing"
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),          // Title is required
    description: Joi.string().required(),    // Description is required
    location: Joi.string().required(),       // Location is required
    country: Joi.string().required(),        // Country is required
    price: Joi.number().required().min(0),   // Price must be a number >= 0 and is required
    image: Joi.object({
      filename: Joi.string().optional(),
      url: Joi.string().optional(),
    }).optional(),
  }).required(),                            // The "listing" object itself is required
});

// Define the validation schema for a "review"
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), // Rating is required and must be between 1 and 5
    comment: Joi.string().required().min(5),       // Comment is required and should have a minimum length of 5
  }).required(),                                   // The "review" object itself is required
});
