const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const port = 3000
const Campground = require('./models/campground.js')


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


//List of the campgrounds:
app.get('/campgrounds', async (req, res) => {
    // save mongo db data into a local variable, then pass through the data and render it. 
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds })
})

// page to add new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// this line of coder allow you to see the req.body.
app.use(express.urlencoded({ extended: true }))

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

// homepage 
app.get('/', (req, res) => {
    res.send('Hello World! from Yelp Camp')
})

app.listen(port, () => {
    console.log(`Yelp camp app listening on port ${port}`)
})