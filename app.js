const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const port = 3000
// the model object is Campground:
const Campground = require('./models/campground.js')
var methodOverride = require('method-override')


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


//List of the campgrounds:
app.get('/campgrounds', async (req, res) => {
    // save mongo db data into a local variable, then pass through the data and render it. 
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds })
})

// CREATE: page to add new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// UPDATE: page to update a campground
// render the "edit" page:
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    res.render('campgrounds/edit', { campID, campground })
})

// app.put is used to update campground
app.put('/campgrounds/:id', async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send('it works!')
})



// save the new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body)
})

//Show 1 campground: 
app.get('/campgrounds/:id', async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    res.render('campgrounds/show', { campID, campground })
})

// campground home page
app.get('/home', (req, res) => {
    res.render('home')
})

// test page 
app.get('/', (req, res) => {
    res.send('Hello World! from Yelp Camp')
})

app.listen(port, () => {
    console.log(`Yelp camp app listening on port ${port}`)
})