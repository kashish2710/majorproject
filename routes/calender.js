// routes/calendar.js

const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const Booking = require("../models/bookings"); 
const Listing = require("../models/listings"); 

// Middleware to check login 
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to view your calendar.");
        return res.redirect("/login");
    }
    next();
};

// =========================================================
// GET Route: Display My Calendar Page (URL: /mycalendar)
// =========================================================
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch User's Bookings
        const bookings = await Booking.find({ buyer: userId })
            .populate({
                path: 'listing',
                select: 'title startDate endDate price location country'
            })
            .lean(); 

        // 2. Fetch User's Hosted Listings
        const hostedListings = await Listing.find({ owner: userId })
            .select('title startDate endDate capacity booked_count')
            .lean();

        // Data ko Calendar view mein bhej dein
        // ✅ Ye 'calender' render path aapki EJS file 'views/users/calender.ejs' se match karta hai.
        res.render("users/calender", { 
            bookings, 
            hostedListings 
        });

    } catch (err) {
        console.error("Calendar Data Fetch Error:", err);
        req.flash("error", "Could not load calendar data.");
        res.redirect("/listings");
    }
});

// =========================================================
// GET Route: Fetch Bookings Data as JSON (URL: /mycalendar/events)
// =========================================================
router.get("/events", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const bookingEvents = await Booking.find({ buyer: userId })
            .populate('listing', 'title startDate endDate')
            .then(bookings => bookings.map(booking => ({
                title: booking.listing.title,
                start: booking.listing.startDate,
                end: booking.listing.endDate,
                url: `/bookings/${booking._id}`,
                color: '#FF7043' 
            })));
            
        const hostedEvents = await Listing.find({ owner: userId })
            .select('title startDate endDate')
            .then(listings => listings.map(listing => ({
                title: `HOST: ${listing.title}`,
                start: listing.startDate,
                end: listing.endDate,
                url: `/listings/${listing._id}`,
                color: '#5e35b1' 
            })));

        res.json([...bookingEvents, ...hostedEvents]);

    } catch (err) {
        res.status(500).json({ error: "Failed to load events." });
    }
});


module.exports = router;