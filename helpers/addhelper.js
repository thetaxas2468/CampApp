const campGround = require("../models/campground");
const helper = require("./helper");
const mongoose = require("mongoose");


const sample = arr => arr[Math.floor(Math.random() * arr.length)];

mongoose.connect("mongodb://localhost:27017/camp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("Database has been connected.");
})

const add = async () => {
    await campGround.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campGround({
            author: "6429eedf6b22f8e65687e118",
            location: `${helper[0][rand].city},${helper[0][rand].state}`,
            title: `${sample(helper[1][0])} ${sample(helper[1][1])}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dy8igq4ea/image/upload/v1680540767/Campgrounds/eavvhoxsfs1ns0itnqs6.jpg',
                  filename: 'Campgrounds/eavvhoxsfs1ns0itnqs6',
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price,
        })
        await camp.save();
    }
}

add().then(() => {
    mongoose.connection.close();
})
