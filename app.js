const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:2000/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})  //useCreateIndex: true,  - is removed due to not beeing supported for version 6 and up.

const db = mongoose.connection;
db.on('error', console.error.bind(console,'Connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true})); //legger til denne for å parse  POST requester, hvis ikke er req.body tom.
app.use(methodOverride('_method'));



app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req,res) => {
    res.redirect(`/campgrounds`);

})

 


 app.all('*',(req,res, next)=>{
     next(new ExpressError('Page Not Found', 404));
 })

app.use((err, req,res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message= 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
    
})

app.listen(3000,()=>{
    console.log('Serving on port 3000');

})