// this is the schema validation. It acts as the second defence line 
// follow the doc, it is easy to write. 

const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    reviews: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5)
    }).required()
})
