const Listing = require("../models/listing.js");
module.exports.index =  async (req , res) => {
    let allListings = await Listing.find({})
    res.render("./listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req , res) => {
    res.render("./listings/new.ejs");
};

module.exports.postNewListing = async (req , res , next) => {
    let {url , filename} = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename , url};
    await newListing.save();
    
    req.flash("success" , "New listing created!"); //key - value
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req , res) => {
    let {id} = req.params;
    const currListing = await Listing.findById(id);
    if(!currListing) {
        req.flash("error" , "listing not found!");
        return res.redirect("/listings");
    }

    let originalImageUrl = currListing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload" , "/upload/h_200,w_250");
    res.render("./listings/edit.ejs" , {currListing , originalImageUrl});
};

module.exports.editListing = async (req , res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof(req.file) !== "undefined") {
        let {url , filename} = req.file;
        listing.image = {url , filename};
        await listing.save();
    }
    
    req.flash("success" , "Listing Edited!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req , res) => {
    let {id} = req.params;    
    await Listing.findByIdAndDelete(id);
    console.log("listing and all its reviews deleted");
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.showListing = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    // console.log(listing);
    if(!listing) {
        req.flash("error" , "listing not found!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs" , {listing});
};