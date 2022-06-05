const express = require('express')
const mongoose = require('mongoose');
const path =require('path')
const port = 3000

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected")
})


const app = express()



// use EJS for HTML templating: use a template to render data. 
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/home', (req, res) => {
    res.render('home')
  })

app.get('/', (req, res) => {
  res.send('Hello World! from Yelp Camp')
})

app.listen(port, () => {
  console.log(`Yelp camp app listening on port ${port}`)
})