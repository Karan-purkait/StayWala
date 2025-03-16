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
app.use("/",userrouter)
// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
  });

// Start the server
const PORT = 8080;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/listings`);
  (await open).default(`http://localhost:${PORT}/listings`);
});

module.exports = app;
