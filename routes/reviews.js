//Merge params to have access to all of the url params
const router = require("express").Router({ mergeParams: true });
const catchAsync = require("../helpers/handleAsync");
const { validateReviewMiddleWare, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");



router.post('/', isLoggedIn, validateReviewMiddleWare, catchAsync(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;