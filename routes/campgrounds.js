const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground.js')
const { ensureLogin, isAuthor, validateCampground } = require('../middleware')
// require the controller file.
const campgrounds = require('../controllers/campground')

//Show all campgrounds:
router.get('/', catchAsync(campgrounds.index))

// Render the "create new campground page"
router.get('/new', ensureLogin, campgrounds.renderNewForm)

// save the new campground
router.post('/', ensureLogin, validateCampground, catchAsync(campgrounds.createNewCampground))

//Show a specific campground: 
router.get('/:id', catchAsync(campgrounds.showCampground))

// render the "edit" page:
router.get('/:id/edit', ensureLogin, isAuthor, catchAsync(campgrounds.renderEditForm))

// edit campground
router.put('/:id/edit', ensureLogin, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))

// delete camground, and remove all reviews under the campground
router.delete('/:id', ensureLogin, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router