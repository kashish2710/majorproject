  const Listing=require("./models/listings");
  const ExpressError=require("./utils/ExpressError.js");
  const Review=require("./models/review");
  const { listingSchema } = require("./schema.js"); 

  module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
    req.flash("error","You must be logged for more");
    req.session.redirectUrl=req.originalUrl;
   return  res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    
  }
  next();
}

module.exports.validateListing=(req,res,next)=>{
let{error}=listingSchema.validate(req.body);
if(error){
 let errMsg=error.details.map((el)=>el.message).join(',');
throw new ExpressError(400,errMsg);
}
else{
next();
}
};

module.exports.isOwner=async(req,res,next)=>{
    let { id }=req.params;
  let listing=await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission to change ");
    return res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.isAuthor=async(req,res,next)=>{
  let{id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not author of this Review");
   return res.redirect(`/listings/${id}`);
  }
  next();
}