const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
})
// the first arg is the ingular name of the collection.
// mongoose will use campgrounds as collection in the database. 
module.exports = mongoose.model('Review', ReviewSchema);
