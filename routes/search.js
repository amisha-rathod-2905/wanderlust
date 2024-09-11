// routes/search.js
const express = require('express');
const Listing = require('../models/listing'); // Make sure the path to your Listing model is correct
const router = express.Router();

// Route: GET /search?location={locationName}
router.get('/search', async (req, res) => {
    try {
        // Get the search query from the form input
        const locationQuery = req.query.location;

        // Ensure that the user entered a location
        if (!locationQuery) {
            return req.flash('Please provide a location to search.');
        }

        // Perform case-insensitive search for listings based on the location field
        const listings = await Listing.find({
            location: { $regex: locationQuery, $options: 'i' } // 'i' flag makes it case-insensitive
        });

        // Render search results or send a JSON response
        res.render("searchResults.ejs", { listings }); // You can change this to your preferred view engine
        // Or if using a JSON response:
        // res.json(listings);

    } catch (error) {
        console.error("Error occurred during search:", error);
        res.status(500).send('An error occurred during the search.');
    }
});

module.exports = router;
