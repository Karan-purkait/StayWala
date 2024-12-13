const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const initData = require("./init/data.js");
const initDB = require("./init/index.js"); 

const ejsMate = require("ejs-mate");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

// Create Route
app.post("/listings", async (req, res) => {
  const newListing = {
    ...req.body.listing,
    image: {
      url: req.body.listing.image.url,
    },
  };
  const listing = new Listing(newListing);
  await listing.save();
  res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

// Update Route
app.put("/listings/:id", async (req, res) => {
  const updatedListing = {
    ...req.body.listing,
    image: {
      url: req.body.listing.image.url,
    },
  };
  await Listing.findByIdAndUpdate(req.params.id, updatedListing);
  res.redirect(`/listings/${req.params.id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
