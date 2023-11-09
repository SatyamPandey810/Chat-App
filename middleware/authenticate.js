const authenticate = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/profile')
    } else {
        next()
    }
   
}

const authorization = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    authenticate,
    authorization
}