const campGround = require("../models/campground");
const helper= require("./helper");
const mongoose=require("mongoose");


const sample = arr=>arr[Math.floor(Math.random()*arr.length)];

mongoose.connect("mongodb://localhost:27017/camp",{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Database has been connected.");
})

const add = async ()=>{
    await campGround.deleteMany({});
    for(let i=0;i<50;i++){
        let rand=Math.floor(Math.random() * 1000);
        const camp=new campGround({
            location:`${helper[0][rand].city},${helper[0][rand].state}`,
            title:`${sample(helper[1][0])} ${sample(helper[1][1])}`
        })
        await camp.save();
    }
    mongoose.connection.close();
}

add();