const express=require("express");
const catchAsync = require("../helpers/handleAsync");
const router = express.Router();
const CustomError = require("../helpers/CustomError");
const Campground = require("../models/campground");
const campgroundSchema = require("../schemas/campgroundJoiSchema");

const validateCampgroundMiddleWare = (req,res,next)=>{

    const {error} = campgroundSchema.campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e => e.message).join(",")
        throw new CustomError(msg,400);
    }
    else{
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampgroundMiddleWare ,catchAsync( async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id',validateCampgroundMiddleWare, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;