const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then((res) => {
        console.log("Connection to db successfull");
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(port , (req , res) => {
    console.log(`Server is listening at port: ${port}`);
});

app.get("/" , (req , res) => {
    res.send("Welcome to server");
});

// app.get("/testListing" , async (req , res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "Lesss go" , 
//         price: 1000 , 
//         location: "Delhi" , 
//         country: "Europe"
//     });

//     await sampleListing.save()
//         .then((res) => {console.log("test success");})
    
//     res.send("test success");
// })

// all listings route
app.get("/listings" , async (req , res) => {
    let allListings = await Listing.find({})
    res.render("./listings/index.ejs" , {allListings});
});

// new route
app.get("/listing/new" , (req , res) => {
    res.render("./listings/new.ejs");
});

app.post("/listing/new" , async (req , res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route
app.get("/listing/:id/edit" , async (req , res) => {
    let {id} = req.params;
    const currListing = await Listing.findById(id);
    // console.log(currListing);
    res.render("./listings/edit.ejs" , {currListing});
});

app.put("/listing/:id/edit" , async (req , res) => {
    let {id} = req.params;
    // console.log(req.body.listing);
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
});

// delete route
app.delete("/listing/:id/delete" , async (req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// show route
app.get("/listing/:id" , async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id) ;
    res.render("./listings/show.ejs" , {listing});
})