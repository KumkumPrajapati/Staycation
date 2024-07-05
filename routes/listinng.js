const express= require("express");
const router= express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner}= require("../middlewear.js");
const controllerListing = require("../controllers/listings.js")
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const validateListing = (req,res,next)=>{
    const{error}  = listingSchema.validate(req.body);
    
    if(error){
        let errMsg =error.details.map((el) => el.message).join(",");
          throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

router.route("/")
.get( wrapAsync(controllerListing.index))
.post(isLoggedIn,  upload.single("listing[image]"), validateListing , wrapAsync(controllerListing.createListing ));



//new
router.get("/new",isLoggedIn, wrapAsync(controllerListing.renderNewForm) );


router.route("/:id")
.get( wrapAsync(controllerListing.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing , wrapAsync(controllerListing.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(controllerListing.destroyListing ));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(controllerListing.editListing));


module.exports = router;