const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    filename: String,
    url: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  embedding: {
    type: [Number],
    index: true,
    dimensions: 128
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
