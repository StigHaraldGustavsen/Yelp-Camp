const mongoose = require('mongoose');
const Campground = require('../models/campground')

const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:2000/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})  //useCreateIndex: true,  - is removed due to not beeing supported for version 6 and up.

const db = mongoose.connection;
db.on('error', console.error.bind(console,'Connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];
//laptops : 62def3e5791e2f28c1dc67da
//dekstop : 62def3e5791e2f28c1dc67da

const seedDB = async() =>{
    console.log('deleting old campgrounds')
    await Campground.deleteMany({});

    for(let i = 0; i < 50; i++){
        const random10000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '62def3e5791e2f28c1dc67da',
            location: `${cities[random10000].city}, ${cities[random10000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque, quam quos ut blanditiis optio est dignissimos quidem! Possimus dicta vero ut, aspernatur ipsum aperiam dolorum? Saepe repellendus sunt esse itaque.',
            price: price, 
            images: [
                {
                  url: 'https://res.cloudinary.com/dvhvu7vif/image/upload/v1657477461/YelpCamp/cbatawseziraa3mzh4au.jpg',
                  filename: 'YelpCamp/cbatawseziraa3mzh4au',
                },
                {
                  url: 'https://res.cloudinary.com/dvhvu7vif/image/upload/v1657477461/YelpCamp/rdpofbpptz7pexscczr4.jpg',
                  filename: 'YelpCamp/rdpofbpptz7pexscczr4',
                },
                {
                  url: 'https://res.cloudinary.com/dvhvu7vif/image/upload/v1657477461/YelpCamp/ecsuopjrkjtprrqjufhk.jpg',
                  filename: 'YelpCamp/ecsuopjrkjtprrqjufhk',
                },
                {
                  url: 'https://res.cloudinary.com/dvhvu7vif/image/upload/v1657477461/YelpCamp/wxq4p5abgmkos8hz7b1k.jpg',
                  filename: 'YelpCamp/wxq4p5abgmkos8hz7b1k',
                }
              ],
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    db.close();
    console.log('New seed seeded')
});
