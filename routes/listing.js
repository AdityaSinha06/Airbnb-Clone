const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// Index route
router.get("/" , wrapAsync(listingController.index));

// Edit Route
router.route("/:id/edit")
    .get(isLoggedIn , isOwner , wrapAsync(listingController.renderEditForm))
    .put(isLoggedIn, upload.single('listing[image]') , validateListing , wrapAsync(listingController.editListing));

//new route
router.route("/new")
    .get(isLoggedIn , listingController.renderNewForm)
    .post(isLoggedIn, upload.single('listing[image]') , validateListing , wrapAsync(listingController.postNewListing));
    // .post(, (req , res) => {
    //     res.send(req.file); // our file has reached backend , from the interface, now , need to store it in db, can't store img : so upload to cloud , get link and save that link to db
    // });

// delete route
router.delete("/:id/delete" , isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));


// show route
router.get("/:id" ,wrapAsync(listingController.showListing));

module.exports = router;