const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const open = import("open"); // Use dynamic import for ESM modules
const userrouter=require("./routes/user")
const signuprouter=require("./routes/signup")
const signinrouter=require("./routes/signin")
const statusMonitor = require('express-status-monitor');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
app.use(statusMonitor());
// Custom Express Error Class


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// MongoDB Connection
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
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
app.use(cookieParser()); 
app.use(
  session({
      secret: "Subha2003",
      resave: false,
      saveUninitialized: true,
  })
);
app.use("/",userrouter)
app.use("/signup",signuprouter)
app.use("/signin",signinrouter)
// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  //res.status(statusCode).render("error", { message });
  res.status(statusCode).json({ Message: message });
  });

// Start the server
const PORT = 8080;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  (await open).default(`http://localhost:${PORT}/`);
});

