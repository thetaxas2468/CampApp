const mongoose=require("mongoose");
const Review = require("./review");



const campgroundSchema= new mongoose.Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:mongoose.Types.ObjectId,
            ref:"review"
        }
    ]
})

campgroundSchema.post("findOneAndDelete",async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{$in:doc.reviews}
        })
    }
})

module.exports = mongoose.model("campground",campgroundSchema);