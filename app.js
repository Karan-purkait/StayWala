const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const open = import("open"); // Use dynamic import for ESM modules
const userrouter=require("./routes/user")

const statusMonitor = require('express-status-monitor');

const app = express();
app.use(statusMonitor());

// Custom Express Error Class
class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// MongoDB Connection
async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(statusMonitor());

// Middleware for validation
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

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Wanderlust!");
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
    const updatedListing = {
      ...req.body.listing,
      image: req.body.listing.image || { filename: "", url: "" },
    };
    await Listing.findByIdAndUpdate(req.params.id, updatedListing, { new: true });
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


app.use("/",userrouter)

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  //res.status(statusCode).render("error", { message });
  res.status(statusCode).json({ Message: message });
  });

// Start the server
const PORT = 8080;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/listings`);
  (await open).default(`http://localhost:${PORT}/listings`);
});

