const express=require("express");
const router=express.Router();
const passport=require("passport");
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const listingController=require("../controllers/user");
router.get("/signup",listingController.requestsignup);
router.get("/login",listingController.requestlogin);
router.post("/login",saveRedirectUrl,  passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),listingController.login);

router.post("/signup",listingController.signup);
//logout-route
router.get("/logout",listingController.logout);
module.exports=router;
// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync");
// const { saveRedirectUrl } = require("../middleware.js");
// const userController = require("../controllers/user");

// // ✅ show signup form
// router.get("/signup", userController.requestsignup);

// // ✅ signup new user
// router.post("/signup", wrapAsync(userController.signup));

// // ✅ show login form
// router.get("/login", userController.requestlogin);

// // ✅ login user (redirect url handled)
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

// // ✅ logout
// router.get("/logout", userController.logout);

// module.exports = router;
