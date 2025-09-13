require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const { data } = require("./init/data.js");


const MONGO_URL = process.env.DB_URL;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("Mongo connection error:", err));

async function seedDB() {
    await Listing.deleteMany({}); // purani listings hata de
    await Listing.insertMany(data); // sample data insert kar de
    console.log("Database seeded with sample listings!");
    mongoose.connection.close();
}

seedDB();
