const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main().then(()=>{
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yolostay');

}

initDB =async()=>{
   
    await Listing.insertMany(initData.data);
    console.log("Data is initialized")
};
initDB();