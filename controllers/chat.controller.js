
const User = require("../models/User");
const {EventEmitter} = require('events')
const event =new EventEmitter();

const chat = async (req, res) => {
    const users = await User.find({ _id: { $ne: req.session.user._id } });

    let mapedUsers = users.map((user) => {
        let newUser = { ...user._doc }
        user.status = user.onlineStatus ? 'online' : 'offline'
        return newUser;
    })
    res.render('chat', { users: mapedUsers, currentUser: req.session.user });
}

const profile = (req, res) => {
    res.render('profile', { currentUser: req.session.user })
}
const profileUpdate = async (req, res) => {
    let currentUser = req.session.user;

    if (currentUser) {

        await User.updateOne({ _id: currentUser._id }, {
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            profileImage: req.file.path.replace('public', ''),
            phone: req.body.phone
        })

        let user = await User.findOne({ _id: currentUser._id });
        req.session.User = user;
    } else {
        return res.redirect('/login')
    }
    return res.redirect('/profile');
}

const accountSuspend = async (req, res) => {

    await User.updateOne({ _id: req.session.user._id }, {
        accountSuspend: true

    });


    req.session.destroy();

    res.redirect('/login');

}

const logout = async (req, res) => {
    await User.updateOne({ _id: req.session.user._id }, {
        onlineStatus: false
    });

    req.session.destroy();

    res.redirect('/login');

}



module.exports = {
    chat,
    profile,
    logout,
    profileUpdate,
    accountSuspend
}