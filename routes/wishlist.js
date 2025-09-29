// routes/wishlist.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Middleware to check login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // Agar user logged out hai, toh 401 JSON error dega
    return res.status(401).json({ success: false, message: "Login required." });
}

// POST Route: Toggle Wishlist
// URL: /wishlist/:id
router.post("/:id", isLoggedIn, async (req, res) => {
    try {
        const listingId = req.params.id;
        const userId = req.user._id;

        // Step 1: Check karein ki item pehle se saved hai ya nahi
        const user = await User.findById(userId);
        
        // .some() Mongoose Object IDs ko compare karne ka sabse reliable tareeka hai
        const isCurrentlySaved = user.wishlist.some(id => id.toString() === listingId); 
        
        let updateOperation;
        let isSaved;

        if (isCurrentlySaved) {
            // Item saved hai: Remove karo ($pull)
            updateOperation = { $pull: { wishlist: listingId } };
            isSaved = false;
        } else {
            // Item saved nahi hai: Add karo ($push)
            updateOperation = { $push: { wishlist: listingId } };
            isSaved = true;
        }

        // Step 2: Database mein update karo (findByIdAndUpdate is simple)
        await User.findByIdAndUpdate(userId, updateOperation);
        
        // Step 3: Frontend ko JSON response do
        return res.json({ success: true, saved: isSaved });

    } catch (error) {
        console.error("Wishlist Toggle Error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

module.exports = router;