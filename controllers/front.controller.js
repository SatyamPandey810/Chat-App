const bcrypt = require('bcrypt');
const User = require("../models/User");
const { Cookie } = require('express-session');

// login 
const login = (req, res) => {
    return res.render('login');

}
// register
const register = (req, res) => {
    res.render('register');
}

const registerStore = async (req, res) => {
    await User.create({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    res.redirect('/login')
}

const loginStore = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        if( user.accountSuspend){
            return res.redirect('/login');
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
            await User.updateOne({ email: req.body.email }, { onlineStatus: true })

            req.session.user = user;

            return res.redirect('/profile');
        }
    }
    else {
        return res.redirect('/login');
    }
}

module.exports = {
    login,
    register,
    registerStore,
    loginStore
}
