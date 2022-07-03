const express = require('express')
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync')
const { route } = require('./campgrounds');
const router = express.Router({ mergeParams: true })

const Campground = require('../models/campground.js')
const Review = require('../models/review.js')

const { ensureLogin, validateReview, isReviewAuthor } = require('../middleware')
// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})




router.post('/', ensureLogin, validateReview, catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID).populate('reviews');
    const review = new Review(req.body.reviews);
    review.author = req.user._id;
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    req.flash('success', 'New review created!');
    res.redirect(`/campgrounds/${campground._id}`)
}))


// delete review
router.delete('/:reviewId', ensureLogin, isReviewAuthor, catchAsync(async (req, res) => {
    const campID = req.params.id;
    const reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(req.params.reviewId)
    // remove the reference in campground document's review field. 
    await Campground.findByIdAndUpdate(campID, { $pull: { reviews: reviewId } })
    req.flash('warning', 'Successfully deleted a review! ');
    res.redirect(`/campgrounds/${req.params.id}`)
}))

module.exports = router