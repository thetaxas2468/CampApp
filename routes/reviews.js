//Merge params to have access to all of the url params
const router = require("express").Router({mergeParams:true});
const Review = require("../models/review");
const reviewSchema = require("../schemas/reviewsJoiSchema");
const Campground = require("../models/campground");
const catchAsync = require("../helpers/handleAsync");
const CustomError = require("../helpers/CustomError");


const validateReviewMiddleWare = (req,res,next)=>{
    const {error} = reviewSchema.reviewsSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=>e.message).join(",");
        throw new CustomError(msg,400);
    }
    else{
        next();
    }
}

router.post('/',validateReviewMiddleWare ,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId",catchAsync( async (req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router;