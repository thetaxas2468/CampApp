const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const CustomError = require("./helpers/CustomError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localPassort = require("passport-local");
const User = require("./models/user");

const reviewsRoutes = require("./routes/reviews.js");
const campgroundRoutes = require("./routes/campgrounds");
const userRoutes = require("./routes/users");

mongoose.connect("mongodb://localhost:27017/camp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("Database has been connected.");
})


const app = express();


app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Line code to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfigiration = {
    secret: "thisisnotasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfigiration));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new localPassort(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);



// Unexisted route
app.all('*', (req, res, next) => {
    next(new CustomError("Page Not Found", 404));
})

// Error handling 
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("Server listening at port 3000");
})