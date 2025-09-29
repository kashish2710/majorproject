const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review"); 
const User = require("./user"); 

const listingSchema = new Schema({
  title: String,
  image: { url: String },
  description: String,
  price: Number,
  location: String,
  country: String,
  capacity: Number,
  booked_count: { type: Number, default: 0 },

  // 📞 Default fake contact
  contact: { 
    type: String, 
    default: "+91 9876543210" 
  },

  // 📆 Default next Saturday or Sunday
  date: {
    type: Date,
    default: () => {
      const today = new Date();
      const day = today.getDay(); // 0 = Sunday, 6 = Saturday

      // Calculate days until next Saturday or Sunday
      const daysUntilSaturday = (6 - day + 7) % 7 || 7;
      const daysUntilSunday = (7 - day) % 7 || 7;

      // Choose whichever is sooner (Saturday preferred)
      const daysUntilNextWeekend = Math.min(daysUntilSaturday, daysUntilSunday);

      const nextWeekend = new Date();
      nextWeekend.setDate(today.getDate() + daysUntilNextWeekend);
      return nextWeekend;
    }
  },

  additionalInfo: { type: String, default: "No extra info available" },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});


// Collection
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
