const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const User=require("../models/user.js");
module.exports.logout=(req,res,next)=>{
 req.logout((err)=>{
  if(err){
    return next(err);
  }
  req.flash("success","You are logged out");
  res.redirect("/listings");
});
};
module.exports.signup=wrapAsync(async(req,res)=>{
    try{
   let {username,email,password}=req.body;
    const newUser =new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
     req.flash("success","Explore with us");
    res.redirect("/listings");
    })
   
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
 
});
module.exports.login=async(req,res)=>{
req.flash("success","Welcome Back !");
let redirectUrl=res.locals.redirectUrl || "/listings";
 if (redirectUrl.includes("/reviews")) {
      const listingId = redirectUrl.split("/")[2];
      redirectUrl = `/listings/${listingId}`;
    }
res.redirect(redirectUrl);

}
module.exports.requestsignup=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.requestlogin=(req,res)=>{
    res.render("users/login.ejs");
}
// const Listing = require("../models/listings.js");
// const User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync.js");

// // ✅ Logout user
// module.exports.logout = (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     req.flash("success", "You are logged out");
//     res.redirect("/listings");
//   });
// };

// // ✅ Signup new user
// module.exports.signup = wrapAsync(async (req, res, next) => {
//   try {
//     let { username, email, password } = req.body;
//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);

//     req.login(registeredUser, (err) => {
//       if (err) {
//         return next(err);
//       }
//       req.flash("success", "Explore with us");
//       res.redirect("/listings");
//     });
//   } catch (err) {
//     req.flash("error", err.message);
//     res.redirect("/signup");
//   }
// });

// // ✅ Login user
// module.exports.login = async (req, res) => {
//   req.flash("success", "Welcome Back!");
//   let redirectUrl = res.locals.redirectUrl || "/listings";

//   // 🔹 Special case: agar review add/edit ke baad login hua ho
//   if (redirectUrl.includes("/reviews")) {
//     const listingId = redirectUrl.split("/")[2];
//     redirectUrl = `/listings/${listingId}`;
//   }

//   res.redirect(redirectUrl);
// };

// // ✅ Render signup form
// module.exports.requestsignup = (req, res) => {
//   res.render("users/signup.ejs");
// };

// // ✅ Render login form
// module.exports.requestlogin = (req, res) => {
//   res.render("users/login.ejs");
// };
