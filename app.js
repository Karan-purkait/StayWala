const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

// Custom Express Error Class
class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}
main().catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to validate listing input
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({ error: errMsg });
  }
  next();
};

// Middleware to validate review input
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({ error: errMsg });
  }
  next();
};

// Root Route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Index Route
app.get("/listings", async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    next(err);
  }
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Route
app.get("/listings/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
});

// Create Route
app.post(
  "/listings",
  validateListing,
  async (req, res, next) => {
    try {
      const newListing = {
        ...req.body.listing,
        image: {
          filename: req.body.listing.image?.filename || "",
          url: req.body.listing.image?.url || "",
        },
      };
      const listing = new Listing(newListing);
      await listing.save();
      res.redirect("/listings");
    } catch (err) {
      next(err);
    }
  }
);

// Edit Route
app.get("/listings/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/edit", { listing });
  } catch (err) {
    next(err);
  }
});

// Update Route
app.put(
  "/listings/:id",
  validateListing,
  async (req, res, next) => {
    try {
      const updatedListing = {
        ...req.body.listing,
        image: {
          filename: req.body.listing.image?.filename || "",
          url: req.body.listing.image?.url || "",
        },
      };
      await Listing.findByIdAndUpdate(req.params.id, updatedListing, { new: true });
      res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  }
);

// Delete Route
app.delete("/listings/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

// Create Review Route
app.post(
  "/listings/:id/reviews",
  validateReview,
  async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) throw new ExpressError(404, "Listing not found");
      const newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      next(err);
    }
  }
);

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
  // Or for API:
  // res.status(statusCode).json({ error: message });
});

// Start the Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
