const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.destroyReview = async (req , res) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success" , "Review Deleted!");
    res.redirect(`/listings/${id}`)
};

module.exports.addReview = async (req , res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    // console.log(review);
    
    listing.reviews.push(review);

    await review.save();
    await listing.save();

    req.flash("success" , "Review Added!");
    console.log("review-saved");
    res.redirect(`/listings/${listing._id}`)
};