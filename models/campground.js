const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async (campground) => {
    if (campground) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

// the first arg is the ingular name of the collection.
// mongoose will use campgrounds as collection in the database. 
const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;
