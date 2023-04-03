const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/handleAsync");
const campgroundController = require("../controllers/campgrounds");
const { isLoggedIn, validateCampgroundMiddleWare, isAuthor } = require("../middleware");
const multer= require("multer");
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(campgroundController.index));

router.get('/new', isLoggedIn, campgroundController.renderNewForm)

router.post('/', isLoggedIn,upload.array('image'), validateCampgroundMiddleWare, catchAsync(campgroundController.createCampground));

router.get('/:id', catchAsync(campgroundController.getCampgroundById));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.getCampgroundEditById));

router.put('/:id', isLoggedIn,isAuthor,upload.array('image') ,validateCampgroundMiddleWare,  catchAsync(campgroundController.editCampgroundById));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampgroundById));

module.exports = router;