const express=require("express");
const router = express.Router({ mergeParams: true });

const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const cors = require('cors');
router.use(cors());
const {reviewSchema}=require("../schema.js");
const {isLoggedin,isAuthor}=require("../middleware.js");
const listingController=require("../controllers/reviews.js")
const validateReview=(req,res,next)=>{
let{error}=reviewSchema.validate(req.body);

if(error){
  let errMsg=error.details.map((el)=>el.message).join(',');
throw new ExpressError(400,errMsg);
}
else{
next();
}
}



//POST review route
router.post("/", isLoggedin, validateReview, listingController.newreview);


//DELETE review route
router.delete("/:reviewId",isLoggedin, isAuthor ,listingController.deletereview);



module.exports=router;
