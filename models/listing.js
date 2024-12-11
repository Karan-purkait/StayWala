const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  // Update image field to be an object containing filename and url
  image: {
    filename: String,
    url: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

