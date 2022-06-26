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




//List of the campgrounds:
app.get('/campgrounds', catchAsync(async (req, res) => {
    // save mongo db data into a local variable, then pass through the data and render it. 
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds })
}))

// CREATE: page to add new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// save the new campground
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // 1. this try and catch error handler should pass the error to the error handler at the bottom of the code.
    // 2. The try catch structure has been replaced by the catchAsync(). 
    // if (!req.body.campground) {
    //     throw new ExpressError("Invalid Campground data", "400 ")
    // }

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body)
}))

// UPDATE: page to update a campground
// render the "edit" page:
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    res.render('campgrounds/edit', { campID, campground })
}))

// app.put is used to update campground
app.put('/campgrounds/:id/edit', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send('it works!')
}))

//Show 1 campground: 
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    res.render('campgrounds/show', { campID, campground })
}))

// Home page, empty for now
app.get('/', catchAsync(async (req, res) => {
    res.render('campgrounds/home')
}))

// delete the camground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))


// post review for a campground
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID).populate('review');
    const review = new Review(req.body.review);
    await review.save();
    campground.review.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
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