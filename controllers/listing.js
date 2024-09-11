const { query } = require("express");
const Listing = require("../models/listing");
const mbxGeocoading = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocoadingCilent = mbxGeocoading({accessToken: mapToken});

module.exports.index =  async (req, res) => {
        let AllListing =await Listing.find({});
        res.render("./listing/index.ejs", {AllListing});
    }

module.exports.renderNewForm = (req, res) => {
        res.render("listing/new.ejs");
}

    module.exports.showListing = async (req, res) => {
        let {id} = req.params;
        let listing = await Listing.findById(id)
        .populate({path: "reviews", populate: {path: "author"},}).populate("owner");
       if(!listing){
        req.flash("error", "The listing you're looking for has been deleted!");
        res.redirect("/listing");
       }
      res.render("listing/show.ejs", {listing});
    }

    module.exports.createNewListing = async ( req, res, next) => { 
      let response = await geocoadingCilent.forwardGeocode({
          query: req.body.Listing.location,
          limit: 1,
        }).send();

        let url = req.file.path;
        let filename = req.file.filename;
          const newListing = new Listing(req.body.Listing);
          newListing.owner = req.user._id; // current user id 
          newListing.image = { url, filename};

          newListing.geometry = response.body.features[0].geometry;

          await newListing.save();
          req.flash("success", "new listing created successfully");
          res.redirect("/listing");
    }

    
    module.exports.editListing = async (req, res) => {
            let {id} = req.params;
            let listing = await Listing.findById(id);
            if(!listing){
              req.flash("error", "The listing you're looking for does not exist!");
              res.redirect("/listing");
            }
            res.render("listing/edit.ejs", {listing});
    }

    module.exports.updateListing = async (req, res) => {
        let {id} = req.params;
        let updatedval = await Listing.findByIdAndUpdate(id, {...req.body.Listing}, {new: true});

        if(typeof req.file !== "undefined") {
          let url = req.file.path;
          let filename = req.file.filename;
          Listing.image = { url, filename};
          await Listing.save();
        }
        req.flash("success", "listing updated successfully !");
        res.redirect(`/listing/${id}`);
    }

    module.exports.destroyListing = async (req, res) => {
      let { id } = req. params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      req.flash("success", "listing deleted successfully...");
      res.redirect("/listing");
    }

