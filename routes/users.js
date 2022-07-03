const express = require('express');
const { session } = require('passport');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user.js')
const user = require('../controllers/user')

router.get('/register', user.renderRegister)

router.get('/login', user.renderLogin)

router.post('/register', user.register)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', user.logout);

module.exports = router;