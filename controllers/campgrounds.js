const Campground = require("../models/campground");



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}).populate("author");
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "New campground has been created!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.getCampgroundById = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "There is no campground with this id");
        return res.redirect("/campgrounds")
    }
    res.render('campgrounds/show', { campground });
}


module.exports.getCampgroundEditById = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "There is no campground with this id");
        return res.redirect("/campgrounds")
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampgroundById = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    if (!campground) {
        req.flash("error", "There is no campground with this id");
        return res.redirect("/campgrounds")
    }
    req.flash("success", " Campground has been updated!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampgroundById = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        req.flash("error", "There is no campground with this id");
        return res.redirect("/campgrounds")
    }
    req.flash("success", "Campground has been deleted!");
    res.redirect('/campgrounds');
}