const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const Listing = require("../models/listings");
const {isLoggedin}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
// Create booking
router.post("/", async (req, res) => {
  try {
    const { listing_id, name, email, phone, seats, notes } = req.body;

    const listing = await Listing.findById(listing_id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (listing.capacity && listing.booked_count + parseInt(seats) > listing.capacity) {
      req.flash("error", "Sorry, not enough seats available!");
      return res.redirect("/listings");
    }

    const booking = new Booking({ listing_id, name, email, phone, seats, notes });
    await booking.save();

    listing.booked_count += parseInt(seats);
    await listing.save();

    //  flash success message
    req.flash("success", " Thank you! Your booking is confirmed.");
    res.redirect("/listings");   
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

router.get("/:id/book", isLoggedin, listingController.bookForm);



module.exports = router;

