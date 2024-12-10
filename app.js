const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

main().then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yolostay');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.send("Hi, I'm Robot");
});

// Fix: Await the Listing.find() promise and pass the resolved data
app.get("/listing", async (req, res) => {
    try {
        const allListings = await Listing.find({}); // Wait for the data
        res.render("listings/index.ejs", { allListings }); // Pass the data to the view
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

app.listen(8080, () => {
    console.log("Server is working");
});
