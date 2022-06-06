const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})
// the first arg is the ingular name of the collection.
// mongoose will use campgrounds as collection in the database. 
module.exports = mongoose.model('Campground', CampgroundSchema);
