const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground.js')
const { campgroundSchema } = require('../schemas.js')



// The middleware to validate campground input data:
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}


//List of the campgrounds:
router.get('/', catchAsync(async (req, res) => {
    // save mongo db data into a local variable, then pass through the data and render it. 
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds })
}))

// CREATE: page to add new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

// save the new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // 1. this try and catch error handler should pass the error to the error handler at the bottom of the code.
    // 2. The try catch structure has been replaced by the catchAsync(). 
    // if (!req.body.campground) {
    //     throw new ExpressError("Invalid Campground data", "400 ")
    // }
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'You just made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body)
}))

// UPDATE: page to update a campground
// render the "edit" page:
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    res.render('campgrounds/edit', { campID, campground })
}))

// router.put is used to update campground
router.put('/:id/edit', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    await campground.save();
    req.flash('success', 'you just updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send('it works!')
}))

//Show campground: 
router.get('/:id', catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID).populate('reviews');
    if (!campground) {
        req.flash('error', 'Can not find this campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campID, campground })
}))


// delete the camground, and remove all reviews under the campground
router.delete('/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

module.exports = router