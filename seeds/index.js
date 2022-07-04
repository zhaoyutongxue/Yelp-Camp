// this is the js file to seed our database for testing purpose.
const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const port = 3000
const Campground = require('../models/campground.js')

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')


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

// randomly access data from array, and save it to sample.
// const sample = array=>
//     array[Math.floor((Math.random)* array.length)]

const sample = array => array[Math.floor(Math.random() * array.length)];


// delete everything in the seed database, then save c. 
const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({title:'purple fields'})
    // await c.save();
    for (let i = 0; i < 10; i++) {
        const ram1000 = Math.round(Math.random() * 10);
        const price = Math.floor(Math.random() * 10)
        const c = new Campground({
            author: '62be3dab046c02121fec22cb',
            location: `${cities[ram1000].city}, ${cities[ram1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dcc4gmbgx/image/upload/v1656917151/YelpCamp/uchomwmjckt3eg0xmdym.png',
                    filename: 'YelpCamp/uchomwmjckt3eg0xmdym'
                },
                {
                    url: 'https://res.cloudinary.com/dcc4gmbgx/image/upload/v1656917156/YelpCamp/jhwz9510qkbhyq2eo7ij.png',
                    filename: 'YelpCamp/jhwz9510qkbhyq2eo7ij'
                }
            ],
            description: 'just typing something',
            price: price

        })
        await c.save();
    }

}


seedDB().then(console.log('seed data written')).then(() => {
    mongoose.connection.close();
});

