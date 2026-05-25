const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const {validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// reviews
// delete route
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


// post route
router.post("/" , isLoggedIn , validateReview, wrapAsync(reviewController.addReview));

module.exports = router;