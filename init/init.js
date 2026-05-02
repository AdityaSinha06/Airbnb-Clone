const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const {data: listingData} = require("./listingData.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
    .then((res) => {
        console.log("connection success");
    })
    .catch(err => {
        console.log(err);
    })


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(listingData);
    console.log("Initialization success");
}

initDB();