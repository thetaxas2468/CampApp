const mongoose=require("mongoose");




const campgroundSchema= new mongoose.Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Review"
        }
    ]
})


module.exports = mongoose.model("campground",campgroundSchema);