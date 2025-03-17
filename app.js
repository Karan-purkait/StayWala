const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const statusMonitor = require("express-status-monitor");
const Listing = require("./models/listing"); // Import Listing model
const Review = require("./models/review"); // Import Review model
const ExpressError = require("./util/ExpressError"); // Import custom error class
const { listingSchema, reviewSchema } = require("./schema"); // Import validation schemas
const userrouter = require("./routes/user"); // Import user routes

const app = express();
app.use(statusMonitor()); // Monitoring middleware

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// **MongoDB Connection**
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
main();

// **View Engine & Static Files**
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// **Validation Middleware**
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

// **Routes**
app.get("/", (req, res) => {
  res.send("Welcome to StayWala!");
});

app.get("/listings", async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    next(err);
  }
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

app.get("/listings/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
});

app.post("/listings", validateListing, async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

app.get("/listings/:id/edit", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/edit", { listing });
  } catch (err) {
    next(err);
  }
});

app.put("/listings/:id", validateListing, async (req, res, next) => {
  try {
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { new: true });
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

app.delete("/listings/:id", async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

app.post("/listings/:id/reviews", validateReview, async (req, res, next) => {
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
});

// **User Routes**
app.use("/", userrouter);

// **Error Handling**
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ Message: message });
});

// **Start Server**
const PORT = 8080;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/listings`);
  
  // **Using Dynamic Import for Open**
  const open = (await import("open")).default;
  open(`http://localhost:${PORT}/listings`);
});
