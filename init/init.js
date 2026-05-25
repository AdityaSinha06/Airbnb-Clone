const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let {data: listingData} = require("./listingData.js");

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
    listingData = listingData.map((obj) => ({...obj, owner: "6a1219c868870e7843b7707e"}));
    await Listing.insertMany(listingData);
    console.log("Initialization success");
}

initDB();