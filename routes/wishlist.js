// // routes/wishlist.js

// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");

// // Middleware to check login
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     // Agar user logged out hai, toh 401 JSON error dega
//     return res.status(401).json({ success: false, message: "Login required." });
// }

// // POST Route: Toggle Wishlist
// // URL: /wishlist/:id
// router.post("/:id", isLoggedIn, async (req, res) => {
//     try {
//         const listingId = req.params.id;
//         const userId = req.user._id;

//         // Step 1: Check karein ki item pehle se saved hai ya nahi
//         const user = await User.findById(userId);
        
//         // .some() Mongoose Object IDs ko compare karne ka sabse reliable tareeka hai
//         const isCurrentlySaved = user.wishlist.some(id => id.toString() === listingId); 
        
//         let updateOperation;
//         let isSaved;

//         if (isCurrentlySaved) {
//             // Item saved hai: Remove karo ($pull)
//             updateOperation = { $pull: { wishlist: listingId } };
//             isSaved = false;
//         } else {
//             // Item saved nahi hai: Add karo ($push)
//             updateOperation = { $push: { wishlist: listingId } };
//             isSaved = true;
//         }

//         // Step 2: Database mein update karo (findByIdAndUpdate is simple)
//         await User.findByIdAndUpdate(userId, updateOperation);
        
//         // Step 3: Frontend ko JSON response do
//         return res.json({ success: true, saved: isSaved });

//     } catch (error) {
//         console.error("Wishlist Toggle Error:", error);
//         return res.status(500).json({ success: false, message: "Server error." });
//     }
// });

// module.exports = router;

// routes/wishlist.js

// routes/wishlist.js

// routes/wishlist.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listings"); // ✅ Make sure this is present

// Middleware to check login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    
    // GET request (page load) ke liye redirect
    if (req.method === 'GET') {
        req.flash("error", "You must be logged in to view your wishlist.");
        res.redirect("/login");
    } else {
        // POST request (AJAX toggle) ke liye JSON error
        return res.status(401).json({ success: false, message: "Login required." });
    }
}

// ===============================================
// ✅ 1. GET Route: Display Wishlist Listings (Yeh route error theek karega)
// URL: /wishlist/
// ===============================================
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        // User ko find karein aur uski 'wishlist' array ko Listing data se populate karein.
        const user = await User.findById(userId)
                               .populate('wishlist'); // IDs ko listings mein badalta hai

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/listings");
        }
        
        const wishlistedItems = user.wishlist;

        // users/wishlist.ejs page render karein
        res.render("users/wishlist", { wishlistedItems });
        
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        req.flash("error", "Could not load your wishlist.");
        res.redirect("/listings");
    }
});

// ===============================================
// 2. POST Route: Toggle Wishlist (Aapka Existing Logic)
// URL: /wishlist/:id
// ===============================================
router.post("/:id", isLoggedIn, async (req, res) => {
    try {
        const listingId = req.params.id;
        const userId = req.user._id;

        const user = await User.findById(userId);
        
        const isCurrentlySaved = user.wishlist.some(id => id.toString() === listingId); 
        
        let updateOperation;
        let isSaved;

        if (isCurrentlySaved) {
            updateOperation = { $pull: { wishlist: listingId } };
            isSaved = false;
        } else {
            updateOperation = { $push: { wishlist: listingId } };
            isSaved = true;
        }

        await User.findByIdAndUpdate(userId, updateOperation);
        
        return res.json({ success: true, saved: isSaved });

    } catch (error) {
        console.error("Wishlist Toggle Error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

module.exports = router;