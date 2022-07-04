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


const seedDB = async() =>{
    console.log('deleting old campgrounds')
    await Campground.deleteMany({});

    const c = new Campground({title: 'purple field'});
    await c.save();
    for(let i = 0; i < 50; i++){
        const random10000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '62c08e6954e0efe8fa503e66',
            location: `${cities[random10000].city}, ${cities[random10000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque, quam quos ut blanditiis optio est dignissimos quidem! Possimus dicta vero ut, aspernatur ipsum aperiam dolorum? Saepe repellendus sunt esse itaque.',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    db.close();
    console.log('New seed seeded')
});
