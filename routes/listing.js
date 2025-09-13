const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const {isLoggedin}=require("../middleware.js");
const{validateListing,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer');
const {storage}=require("../CloudConfigure.js");
const upload = multer({ storage });

// const upload = multer({ storage})
//index route
router.get('/',wrapAsync(listingController.index));


//create-route
router.get('/create',isLoggedin,listingController.createform)


// show route
router.get('/:id',listingController.showlistings);


//newlisting
router.post('/', isLoggedin ,upload.single('listing[image]'),listingController.newlisting);

//edit-route
router.get('/:id/edit',isLoggedin,isOwner,listingController.editlisting);

//update-route
router.put('/:id',isLoggedin,isOwner,upload.single('listing[image]'),listingController.updatelisting);

//search
router.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    let listings = [];
    if (query) {
      listings = await Listing.find({
        country: { $regex: query, $options: "i" }
      });
    } else {
      listings = await Listing.find({});
    }
    res.render("listings/index", { listings });
  } catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
});

//delete-route
router.delete('/:id',isLoggedin,isOwner,listingController.deletelisting);





module.exports=router;