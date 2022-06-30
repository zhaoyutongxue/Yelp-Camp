const express = require('express');
const router = express.Router();
const User = require('../models/user.js')


router.get('/register', (req, res) => {
    res.render('./users/register.ejs');
})
router.post('/register', async (req, res) => {
    // const user = new User(req.body )
    res.send(req.body)
})
module.exports = router;