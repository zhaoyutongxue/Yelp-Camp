const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user.js')

router.get('/register', (req, res) => {
    res.render('./users/register.ejs');
})
router.post('/register', async (req, res) => {
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
})

router.get('/login', (req, res) => {
    res.render('./users/login.ejs');
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    return res.redirect('/campgrounds');
})
module.exports = router;