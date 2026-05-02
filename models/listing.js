const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    } , 
    description: String , 
    image: {
        type: Object,
        default:  {
            filename: "listingimage",
            url: "https://img.magnific.com/free-photo/airbnb-host-welcoming-guests_23-2149872018.jpg?semt=ais_hybrid&w=740&q=80"
        },
        set: (v) => v === "" ? {
            filename: "listingimage",
            url: "https://img.magnific.com/free-photo/airbnb-host-welcoming-guests_23-2149872018.jpg?semt=ais_hybrid&w=740&q=80"
        } : v,
    } , 
    price: {
        type: Number,
        require: true
    } , 
    location: {
        type: String
    } , 
    country: {
        type: String
    }
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;