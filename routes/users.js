const express = require('express');
const router = express.Router();
const User = require('../models/user.js')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('./users/register.ejs');
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email: email, username: username });
        const newUser = await User.register(user, password);
        req.flash('success', 'welcome to yelp-camp!')
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')

    }

}))
module.exports = router;