const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const schema = mongoose.schema

const UserSchema = new schema({
    email: {
        type: String,
        required: true
    }
})
// this will add username and the field of password to the userschema 
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema)

module.exports = User;