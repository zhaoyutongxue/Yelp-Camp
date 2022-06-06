const express = require('express')
const mongoose = require('mongoose');
const path =require('path')
const port = 3000
const Campground = require('./models/campground.js')


mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
})

// from the document: 
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected")
})


const app = express()



// use EJS for HTML templating: use a template to render data. \
// set view engine to EJS.
app.set('view engine','ejs');
// __dirname is an environment variable that tells you the absolute path of the directory containing the currently executing f
app.set('views',path.join(__dirname,'/views'))

app.get('/campgrounds',async(req,res) => {
    // save mongo db data into a local variable, then pass through the data and render it. 
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds})
})


app.get('/home', (req, res) => {
    res.render('home')
  })

app.get('/makecampground', async(req, res) => {
// make a camp instance(it is a Document of Model Campground),
// now it is just an object in javascript, it needs to be saved.
  const camp = new Campground({title:'my backyard', description:'just your backyard '})
  await camp.save();
  res.send(camp); 
})
 


app.get('/', (req, res) => {
  res.send('Hello World! from Yelp Camp')
})

app.listen(port, () => {
  console.log(`Yelp camp app listening on port ${port}`)
})