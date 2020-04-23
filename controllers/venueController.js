
var venues = require("../models/venue");

// get all venues
const getAllVenues = (req, res) => {
    res.send(venues);
};

// get user by id
const getVenueById = (req, res) => {
    // search for user in the database by ID
    const venue = venues.find(user => user.id === req.params.id);

    if (venue) {
        res.send(venue); // send back the author details
    }

    else {
        // you can decide what to return if author is not found
        // currently, an empty list will return
        res.send([]);
    }
};

// create a user
const createVenue = (req, res) => {
    var venue = {
        name: req.body.name,
        address: req.body.address,
        distance: req.body.distance,
        rating: req.body.rating
    };
    var data = new item
};

// delete a user

// update a user by id

// get user by email





module.exports = {
    getAllVenues,
    getVenueById,

};