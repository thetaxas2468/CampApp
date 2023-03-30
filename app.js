const express = require("express");
const path=require("path");
const mongoose=require("mongoose");
const Campground = require("./models/campground");
const methodoverride=require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./helpers/handleAsync");
const CustomError = require("./helpers/CustomError");
const campgroundSchema = require("./schemas/campgroundJoiSchema");
const reviewSchema = require("./schemas/reviewsJoiSchema");
const Review = require("./models/review");


mongoose.connect("mongodb://localhost:27017/camp",{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Database has been connected.");
})


const app = express();


app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
// Line code to parse the body of the request
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));

const validateCampgroundMiddleWare = (req,res,next)=>{

    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(e => e.message).join(",")
        throw new CustomError(msg,400);
    }
    else{
        next();
    }
}

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

app.get("/",(req,res)=>{
    res.render("home");
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampgroundMiddleWare ,catchAsync( async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id',validateCampgroundMiddleWare, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews',validateReviewMiddleWare ,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete("/campgrounds/:id/reviews/:reviewId",catchAsync( async (req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}`)

}))


// Unexisted route
app.all('*',(req,res,next)=>{
    next(new CustomError("Page Not Found",404));
})

// Error handling 
app.use((err,req,res,next)=>{
    const {statusCode = 500 ,message = "Something went wrong"} = err;
    res.status(statusCode).render("error",{err});
})

app.listen(3000,()=>{
    console.log("Server listening at port 3000");
})