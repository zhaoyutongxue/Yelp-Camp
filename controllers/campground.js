const { equal } = require('joi');
const Campground = require('../models/campground.js')

module.exports.index = async (req, res) => {
    // save mongo db data into a local variable, then pass through the data and render it. 
    const campgrounds = await Campground.find().populate();
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createNewCampground = async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    await campground.save();
    console.log(campground)
    req.flash('success', 'You just made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Can not find this campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campID, campground })
}

module.exports.renderEditForm = async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    res.render('campgrounds/edit', { campID, campground })
}

module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'you just updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const campID = req.params.id;
    await Campground.findByIdAndDelete(campID)
    req.flash('warning', 'campground deleted')
    res.redirect('/campgrounds')

}