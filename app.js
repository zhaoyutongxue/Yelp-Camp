const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const port = 3000
// the model object is Campground:
const Campground = require('./models/campground.js')
const Review = require('./models/review.js')

var methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemas.js')

const campgrounds = require('./routes/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected")
})

const app = express()

// use EJS for HTML templating: use a template to render data. \
// set view engine to EJS.
app.set('view engine', 'ejs');
// __dirname is an environment variable that tells you the absolute path of the directory containing the currently executing f
app.set('views', path.join(__dirname, '/views'))
// use npm package "method-override" for HTML verb PUT
app.use(methodOverride('_method'))
// this line of coder allow you to see the req.body.
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate);

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
// The middleware to validate review input data:
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

app.use('/campgrounds', campgrounds)


// Home page, empty for now
app.get('/home', catchAsync(async (req, res) => {
    res.render('campgrounds/home')
}))


app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID).populate('reviews');
    const review = new Review(req.body.reviews);
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


// delete review
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const campID = req.params.id;
    const reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(req.params.reviewId)
    // remove the reference in campground document's review field. 
    await Campground.findByIdAndUpdate(campID, { $pull: { reviews: reviewId } })
    res.redirect(`/campgrounds/${req.params.id}`)
}))


// if nothing matches, response with 404
app.all('*', (req, res, next) => {
    next(new ExpressError('page not found!', 404));
})


// error handling
app.use((err, req, res, next) => {
    // console.log(err);
    const { statusCode = 500 } = err;
    // console.log(err)
    // console.log('this is the err.message: ' + err.message);
    if (!err.message) err.message = 'oh no, something went wrong';
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`Yelp camp app listening on port ${port}`)
})