const Campground = require('./models/campground.js')
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemas.js');

module.exports.ensureLogin = (req, res, next) => {
    // console.log("REQ.USER:" + req.user)
    if (!req.isAuthenticated()) {
        // store the path the user wanted to visit before login
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must sign in first')
        return res.redirect('/login')
    }
    next()
}
// The middleware for authorisation
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author._id.equals(req.user._id)) {
        req.flash('error', 'you dont have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


// The middleware to validate campground input data:
module.exports.validateCampground = (req, res, next) => {
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
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}