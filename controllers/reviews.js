const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
module.exports.newreview=wrapAsync(async (req, res) => {
    
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review({
    comment: req.body.review.comment,
    rating: Number(req.body.review.rating),
    author: req.user._id
  });
console.log("newReview saved!");

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
console.log(newReview);
  
  req.flash("success", "Review added!");
res.redirect(`/listings/${listing._id}`);

})
module.exports.deletereview=wrapAsync(async(req,res)=>{
let{id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{ $pull: {reviews:reviewId}})
await Review.findByIdAndDelete(reviewId);
req.flash("success","Review deleted!");
res.redirect(`/listings/${id}`)
});