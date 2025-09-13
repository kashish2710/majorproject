require('dotenv').config();

console.log(process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const MONGO_URL = process.env.DB_URL;

const ExpressError = require("./utils/ExpressError.js");
const cors = require('cors');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
let User = require("./models/user.js");
const userRouter = require("./routes/user.js");



// Mongo connection
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => {
        console.log("Connection to DB successful!");
    })
    .catch(() => {
        console.log("Failed to connect to DB!");
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

// Session & flash setup
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash + current user available in templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Use routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// 404 handler (if no route matches)
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Global error handler (all errors come here)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});






// Port
app.listen(8080, () => {
    console.log("Port is listening!");
});