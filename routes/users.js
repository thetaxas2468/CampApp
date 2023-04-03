const router = require("express").Router();
const User = require("../models/user");
const catchAsync = require("../helpers/handleAsync");
const passport = require('passport');
const { isLoggedIn } = require("../middleware");
const userController = require("../controllers/user");

router.get("/register", userController.registerPage);

router.post("/register", catchAsync(userController.registerUser));


router.get("/login", userController.loginPage);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser);

router.get('/logout', isLoggedIn, catchAsync(userController.logoutUser));



module.exports = router;