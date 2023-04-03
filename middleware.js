const campgroundSchema = require("./schemas/campgroundJoiSchema");
const reviewSchema = require("./schemas/reviewsJoiSchema");
const Review = require('./models/review');
const CustomError = require("./helpers/CustomError");
const Campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampgroundMiddleWare = (req, res, next) => {
    const { error } = campgroundSchema.campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new CustomError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You cant edit this!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You cant remove this!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}



module.exports.validateReviewMiddleWare = (req, res, next) => {
    const { error } = reviewSchema.reviewsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new CustomError(msg, 400);
    }
    else {
        next();
    }
}