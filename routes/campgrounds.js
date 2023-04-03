const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/handleAsync");
const campgroundController = require("../controllers/campgrounds");
const { isLoggedIn, validateCampgroundMiddleWare, isAuthor } = require("../middleware");

router.get('/', catchAsync(campgroundController.index));

router.get('/new', isLoggedIn, campgroundController.renderNewForm)

router.post('/', isLoggedIn, validateCampgroundMiddleWare, catchAsync(campgroundController.createCampground));

router.get('/:id', catchAsync(campgroundController.getCampgroundById));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.getCampgroundEditById));

router.put('/:id', isLoggedIn, validateCampgroundMiddleWare, isAuthor, catchAsync(campgroundController.editCampgroundById));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampgroundById));

module.exports = router;