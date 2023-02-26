const mongoose = require('mongoose');
const Campground = require('../models/campground')
const User = require('../models/user')
require('dotenv').config()

const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
//mongoose.set('strictQuery', true)
const dbUrl = process.argv[2] || process.env.DB_URL || 'mongodb://localhost:2000/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})  //useCreateIndex: true,  - is removed due to not beeing supported for version 6 and up.

const db = mongoose.connection;
db.on('error', console.error.bind(console,'Connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

const deleteDB = async() =>{
    console.log('deleting old campgrounds')
    await Campground.deleteMany({});
    console.log('deleting users')
    await User.deleteMany({});
}

deleteDB().then(() =>{
    db.close();
    console.log('user and campground databases deleted')
});
