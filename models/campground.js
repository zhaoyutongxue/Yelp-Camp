const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})
// the first arg is the ingular name of the collection.
// mongoose will use campgrounds as collection in the database. 
const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;
