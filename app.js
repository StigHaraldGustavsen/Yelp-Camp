if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');

const usersRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:2000/yelp-camp';
//const dbUrl = 'mongodb://localhost:2000/yelp-camp';

mongoose.set('strictQuery', true)
mongoose.set('strictQuery', true)
mongoose.connect(dbUrl, {
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
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

//https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css
//https://kit-free.fontawesome.com
//https://stackpath.bootstrapcdn.com
//https://api.mapbox.com 
//https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
    "https://cdn.jsdelivr.net",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvhvu7vif/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || 'ThisShouldBeABetterSecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'not-the-session-name',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use((req,res, next)=>{
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',usersRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req,res) => {
    res.render(`home`);

})

 app.all('*',(req,res, next)=>{
     next(new ExpressError('Page Not Found', 404));
 })

app.use((err, req,res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message= 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
    
})

const port = process.env.PORT|| 3000;
app.listen(port,()=>{
    console.log(`Serving app on port ${port}`);

})
