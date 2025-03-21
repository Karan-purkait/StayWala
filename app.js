

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const open = import("open"); // Dynamic import for ESM modules
const userrouter = require("./routes/user");
const signuprouter = require("./routes/signup");
const signinrouter = require("./routes/signin");
const statusMonitor = require("express-status-monitor");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { data: sampleListings } = require("./init/data"); // Import data file

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
app.use(cookieParser());
app.use(
  session({
    secret: "Subha2003",
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/listings", (req, res) => {
  let { location, minPrice, maxPrice, sort } = req.query;
  let listings = [...sampleListings]; 

 
  if (location) {
      listings = listings.filter(listing =>
          listing.location.toLowerCase().includes(location.toLowerCase())
      );
  }

  
  if (minPrice || maxPrice) {
      listings = listings.filter(listing => {
          const price = listing.price || 0; // Default to 0 if price is missing
          return (!minPrice || price >= parseInt(minPrice)) &&
                 (!maxPrice || price <= parseInt(maxPrice));
      });
  }

  // Sorting options
  if (sort === "price-low-high") {
      listings.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high-low") {
      listings.sort((a, b) => b.price - a.price);
  }

  res.render("listings", { allListings: listings });
});
// **Routes**

app.use("/", userrouter);
app.use("/signup", signuprouter);
app.use("/signin", signinrouter);

// **Route to Render Listings Page**



// **Error Handler**
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ Message: message });
});

// **Start Server**
const PORT = 8080;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  (await open).default(`http://localhost:${PORT}/`);
});
