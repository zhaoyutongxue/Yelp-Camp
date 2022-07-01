const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground.js')
const { campgroundSchema } = require('../schemas.js');
const ensureLogin = require('../utils/ensureLogin');



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
    const campgrounds = await Campground.find().populate();
    res.render('campgrounds/index', { campgrounds })
}))

// CREATE: page to add new campground
router.get('/new', ensureLogin, (req, res) => {
    // if (!req.isAuthenticated()) {
    //     req.flash('error', 'you must sign in first')
    //     return res.redirect('/login')
    // }
    res.render('campgrounds/new')
})

// save the new campground
router.post('/', ensureLogin, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'You just made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body)
}))

// UPDATE: page to update a campground
// render the "edit" page:
router.get('/:id/edit', ensureLogin, catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    res.render('campgrounds/edit', { campID, campground })
}))

// router.put is used to update campground
router.put('/:id/edit', ensureLogin, validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    await campground.save();
    req.flash('success', 'you just updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send('it works!')
}))

//Show campground: 
router.get('/:id', catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Can not find this campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campID, campground })
}))


// delete the camground, and remove all reviews under the campground
router.delete('/:id', ensureLogin, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

module.exports = router