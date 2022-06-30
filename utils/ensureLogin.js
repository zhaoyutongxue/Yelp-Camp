// The middleware to ensure user is login:
const ensureLogin = (req, res, next) => {
    // console.log("REQ.USER:" + req.user)
    if (!req.isAuthenticated()) {
        // store the path the user wanted to visit before login
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must sign in first')
        return res.redirect('/login')
    }
    next()
}

module.exports = ensureLogin;