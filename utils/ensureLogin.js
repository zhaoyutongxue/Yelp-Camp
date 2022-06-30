// The middleware to ensure user is login:
const ensureLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must sign in first')
        return res.redirect('/login')
    }
    next()
}

module.exports = ensureLogin;