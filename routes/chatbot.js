const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load listings.json once
const listingsPath = path.join(__dirname, "../init/listings.json");
let listings = JSON.parse(fs.readFileSync(listingsPath, "utf8"));

// Preprocess listings for search
listings = listings.map(l => ({
  ...l,
  searchableText: (l.title + " " + l.description + " " + l.location + " " + l.category).toLowerCase()
}));

// Categories to recognize
const categories = ['yoga', 'fun', 'art', 'dance', 'photography', 'food', 'adventure', 'theatre', 'workshops', 'boat', 'fishing'];

// Vague keywords
const vagueKeywords = ['suggest', 'some', 'anything', 'any', 'ideas', 'show', 'recommend'];

// Greetings
const greetings = ['hi', 'hello', 'hey'];

router.post("/chat", (req, res) => {
  const query = (req.body.query || "").toLowerCase().trim();

  if (!query) {
    return res.json({ answer: "Please type something so I can suggest activities!" });
  }

  // --- Handle greetings ---
  if (greetings.some(g => query.includes(g))) {
    return res.json({ answer: "Hello! 👋 I can suggest fun activities and events. What are you looking for?" });
  }

  // --- Special joke/fun responses ---
  if (query.includes("joke") || query.includes("funny")) {
    return res.json({ answer: "Haha 😄 I'm good at suggesting activities, not jokes! Try looking for something fun to do instead." });
  }

  let maxPrice = null;
  let categoryMatch = null;
  let locationMatch = null;

  // --- Extract budget ---
  const budgetMatch = query.match(/under (\d+)/);
  if (budgetMatch) {
    maxPrice = parseInt(budgetMatch[1]);
  }

  // --- Extract category ---
  for (let cat of categories) {
    if (query.includes(cat)) {
      categoryMatch = cat;
      break;
    }
  }

  // --- Extract location ---
  const locationMatchRegex = /in (\w+)/;
  const locMatch = query.match(locationMatchRegex);
  if (locMatch) {
    locationMatch = locMatch[1].toLowerCase();
  }

  // --- Detect vague queries ---
  const isVague = vagueKeywords.some(k => query.includes(k));

  // --- Filter listings strictly ---
  let results = listings.filter(l => {
    // Must match category if specified
    if (categoryMatch && !l.searchableText.includes(categoryMatch)) return false;
    // Must match location if specified
    if (locationMatch && !l.location.toLowerCase().includes(locationMatch)) return false;
    // Must match budget if specified
    if (maxPrice !== null && l.price > maxPrice) return false;
    // If no category, location, budget, do a general text match
    if (!categoryMatch && !locationMatch && !maxPrice && !isVague) {
      return l.searchableText.includes(query);
    }
    return true;
  });

  // --- If no strict matches but vague query, show top 5 ---
  if (results.length === 0 && isVague) {
    results = listings.slice(0, 5);
  }

  // --- Build reply ---
  let reply = "";
  if (results.length > 0) {
    reply = "Here are some options for you:\n";
    results.slice(0, 5).forEach(r => {
      reply += `• ${r.title} (${r.location}) - ₹${r.price}\n`;
    });
  } else {
    reply = "Sorry, I couldn't find any matching activity 😔";
  }

  res.json({ answer: reply });
});

module.exports = router;
