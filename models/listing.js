const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema=new Schema({
title: {
    type:String,
    required:true

},
description:String,
image:{
    filename: { type: String,
        
    },
    url: {
      type: String,
      default: 'https://unsplash.com/photos/a-couple-of-houses-sitting-on-top-of-a-lush-green-hillside-0yzmwbDu228',
    },
},
price:Number,
location:String,
country:String,

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;