// require('dotenv').config();

// console.log(process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);
// console.log(process.env.SECRET)

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listings.js");
// const methodOverride = require('method-override');
// const path = require('path');
// const ejsMate = require('ejs-mate');
// const MONGO_URL = process.env.DB_URL;

// const ExpressError = require("./utils/ExpressError.js");
// const cors = require('cors');
// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// let User = require("./models/user.js");
// const userRouter = require("./routes/user.js");
// const bookingRoutes = require("./routes/booking.js");

// const { data } = require('./init/data.js'); // yeh tumhare listings ka array


// // Mongo connection
// async function main() {
//     await mongoose.connect(MONGO_URL);
// }
// main()
//     .then(() => {
//         console.log("Connection to DB successful!");
//     })
//     .catch(() => {
//         console.log("Failed to connect to DB!");
//     });

// app.engine('ejs', ejsMate);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());   // 🔥 ye line add karo
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, "/public")));
// app.use(cors());



// // Session & flash setup
// const sessionOptions = {
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge: 7 * 24 * 60 * 60 * 1000
//     }
// };
// app.use(session(sessionOptions));
// app.use(flash());

// // Passport setup
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Middleware to make flash + current user available in templates
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// });

// // Use routes
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);


// app.get("/search", async (req, res) => {
//   try {
//     let query = req.query.q;   // jo user ne type kiya
//     if (!query) {
//       // agar empty search hai toh simply explore page ya all listings dikha do
//       return res.redirect("/listings");
//     }

//     // Regex based case-insensitive search
//     let results = await Listing.find({
//       $or: [
//         { title: { $regex: query, $options: "i" } },       // title match
//         { location: { $regex: query, $options: "i" } }    // location match
//       ]
//     });

//     res.render("listings/searchResults.ejs", { results, query });
//   } catch (err) {
//     console.error(err);
//     res.redirect("/listings");
//   }
// });


// app.use("/bookings", bookingRoutes);

// // 404 handler (if no route matches)
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// // Global error handler (all errors come here)
// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong!" } = err;
//     res.status(statusCode).render("error.ejs", { err });
// });
// //chatbot
// // server.js (ya jahan bhi routes ho)
// const { data } = require("./data.js"); // tumhara sampleListings
// app.use(express.json()); // ensure JSON parsing

// app.post("/chatbot", async (req, res) => {
//   const userMsg = req.body.message.toLowerCase();
//   let reply = "";

//   // 1️⃣ Greetings
//   if (userMsg.includes("hello") || userMsg.includes("hi")) {
//     reply = "Hello 👋! How can I help you today?";
//   } 
//   // 2️⃣ Jokes
//   else if (userMsg.includes("joke")) {
//     reply = "Why don’t programmers like nature? Too many bugs 🐛😂";
//   } 
//   // 3️⃣ Dynamic budget queries (under 500, under 1000, etc.)
//   else if (userMsg.includes("under")) {
//     const budgetMatch = userMsg.match(/under (\d+)/);
//     if (budgetMatch) {
//       const maxPrice = parseInt(budgetMatch[1]);
//       const results = data.filter(d => d.price <= maxPrice).slice(0, 5);
//       if (results.length > 0) {
//         reply = `Here are some options under ₹${maxPrice}:\n`;
//         results.forEach(r => {
//           reply += `• ${r.title} (${r.location}) - ₹${r.price}\n`;
//         });
//       } else {
//         reply = `Sorry, no activities found under ₹${maxPrice} 😔`;
//       }
//     } else {
//       reply = "Please specify a budget, e.g., 'under 1000'.";
//     }
//   } 
//   // 4️⃣ Category/keyword search (dance, food, yoga, adventure...)
//   else {
//     const results = data.filter(d => 
//       d.title.toLowerCase().includes(userMsg) ||
//       d.description.toLowerCase().includes(userMsg)
//     ).slice(0, 5);

//     if (results.length > 0) {
//       reply = "I found these activities for you:\n";
//       results.forEach(r => {
//         reply += `• ${r.title} (${r.location}) - ₹${r.price}\n`;
//       });
//     } else {
//       reply = "I’m not sure, but you can explore all activities here 👉 /listings";
//     }
//   }

//   res.json({ reply });
// });






// // Port
// app.listen(3000, () => {
//     console.log("Port is listening!");
// });


require('dotenv').config();

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
const bookingRoutes = require("./routes/booking.js");
const chatbotRouter = require('./routes/chatbot.js');

const wishlistRoutes = require('./routes/wishlist.js');






//  Import your sample listings once
const { data: listings } = require('./init/data.js'); // init/data.js me tumhara sampleListings

// Mongo connection
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("Connection to DB successful!"))
    .catch(() => console.log("Failed to connect to DB!"));

// EJS & Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON parsing
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

// Session & Flash
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
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

// Flash + current user middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/bookings", bookingRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/api', chatbotRouter); // matches your frontend fetch "/api/chat"



// Search route
app.get("/search", async (req, res) => {
  try {
    let query = req.query.q;
    if (!query) return res.redirect("/listings");

    let results = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } }
      ]
    });

    res.render("listings/searchResults.ejs", { results, query });
  } catch (err) {
    console.error(err);
    res.redirect("/listings");
  }
});


// 404 handler
app.all("*", (req, res, next) => next(new ExpressError(404, "Page Not Found")));

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// Start server
app.listen(3000, () => console.log("Port 3000 is listening!"));
