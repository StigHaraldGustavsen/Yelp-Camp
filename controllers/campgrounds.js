//const campground = require('../models/campground');
const Campground = require('../models/campground');
const isValidCoordinates = require('is-valid-coordinates')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});

const {cloudinary} = require("../cloudinary");



module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res,next)=>{
    //{ type: 'Point', coordinates: [ -122.4077498, 37.654656 ] }
    const campground = new Campground(req.body.campground);
    const CoordSource = req.body.CoordSource

    console.log(req.body)

    if (CoordSource == "location") {
        console.log('coords from geocode')
        const geoData = await geocoder.forwardGeocode({
            query:req.body.campground.location,
            limit: 1
        }).send();
        console.log(geoData.body.features[0].geometry)
        campground.geometry = geoData.body.features[0].geometry
    }
    if (CoordSource === 'device' || CoordSource === 'manual') {
        
        const {longitude,latitude} = req.body      
        if(isValidCoordinates(Number(longitude),Number(latitude))){
            const GeoJSON = { 
                coordinates: [ 
                    Number(longitude), 
                    Number(latitude) 
                ],
                type: 'Point',
            };
            campground.geometry = GeoJSON;
            
        }
        else if(typeof(longitude)=="number" &&typeof(latitude)=="number" ) {
            req.flash('error', 'coordinates given where not accepted, used geocode form location insted')
            const geoData = await geocoder.forwardGeocode({
                query:req.body.campground.location,
                limit: 1
            }).send();
            campground.geometry = geoData.body.features[0].geometry
        }
    }
    //if(!req.body.campground) throw new ExpressError('invalid Campground Data', 400);
    
    
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Sucsessfully created a new campground');
    res.redirect(`campgrounds/${campground._id}`)
}

module.exports.showCamground = async (req, res)=>{

    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
            }
    }).populate('author');
    
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/show', {campground})
}

module.exports.renderEditForm = async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/edit', {campground})

 }

 module.exports.editCampground = async (req,res) => {
    const { id }= req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }
    
    req.flash('success', 'Sucsessfully updated campground');
    res.redirect(`/campgrounds/${campground.id}`)

 }

 module.exports.deleteCampground = async (req,res) => {
    
    const { id }= req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted campground');
    res.redirect(`/campgrounds`)

}