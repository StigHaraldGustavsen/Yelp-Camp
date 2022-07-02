const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req,res)=>{
    res.render('users/register')
})
router.post('/register', catchAsync(async(req,res)=>{
    try {
        const {username, email, password} = req.body;
        const user = new User({email,username});
        const registeredUser =   await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Yelp Camp!');
            res.redirect('/campgrounds')
        })

    } catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }
}))

router.get('/login', (req, res) =>{
    console.log(req.session.retrunUrl)
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
    //Can't get the return to where we come from to work. the req.sessions.returUrl seam to dissapear when this post method is called... 
    console.log(req.session.retrunUrl)
    const redirectUrl =  req.session.retrunUrl || '/campgrounds';
    console.log("The return to adress is : ",req.session.retrunUrl)
    console.log("Redirected to: ",redirectUrl)
    req.flash('success', 'welcome back!');
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    //https://medium.com/passportjs/fixing-session-fixation-b2b68619c51d - not as the course says, due to breaking change
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
      });
    
    //req.logout();
    //res.redirect('/campgrounds');
})

module.exports = router;