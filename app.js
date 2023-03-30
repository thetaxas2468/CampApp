const express = require("express");
const path=require("path");
const mongoose=require("mongoose");
const methodoverride=require("method-override");
const ejsMate = require("ejs-mate");
const CustomError = require("./helpers/CustomError");



const reviewsRoutes = require("./routes/reviews.js");
const campgroundRoutes = require("./routes/campgrounds");


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
app.use(express.static(path.join(__dirname,"public")));



app.get("/",(req,res)=>{
    res.render("home");
})


app.use("/campgrounds",campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);



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