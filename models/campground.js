const mongoose = require("mongoose");
const Review = require("./review");



const campgroundSchema = new mongoose.Schema({
    title: String,
    image: [{
        url:String,
        filename:String,
    }],
    price: Number,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review"
        }
    ]
})

campgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model("campground", campgroundSchema);