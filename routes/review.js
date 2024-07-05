const express= require("express");
const router= express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const{isLoggedIn,isAuthor} = require("../middlewear.js");

const reviewcontroller   = require("../controllers/review.js")



const validateReview = (req,res,next)=>{
    const{error}  = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg =error.details.map((el) => el.message).join(",");
          throw new ExpressError(400,errMsg);
    }else{reviewcontroller
        next();
    }
};

//review post routr
router.post("/", isLoggedIn ,validateReview,wrapAsync(reviewcontroller.createReview));

 
 //review delete routr
 router.delete("/:reviewId", isLoggedIn,isAuthor,wrapAsync(reviewcontroller.destroyReview));

 module.exports= router;