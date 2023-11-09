// core modules
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { engine } = require('express-handlebars');
const session = require('express-session')
const cookieParser = require('cookie-parser');
var MongoDBStore = require('connect-mongodb-session')(session);
const hbs = require('hbs')
const http = require('http')
const User = require("./models/User");
const Message = require("./models/Message");



// app instance
const app = express()
var server = http.createServer(app);


//add socket io
const io = require('socket.io')(server);


// parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
    secret: 'user_id',
    resave: false,
    store: store,
    saveUninitialized: false,
    cookie: { expires: 60000 }
}))


var store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/chat',
    collection: 'mySessions'
});




// static files serve
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, "./views/partials"))


// connect database
mongoose.connect('mongodb://127.0.0.1:27017/chat').then(() => {
    console.log("connection established");
}).catch((error) => console.log(error.message));

// views
// app.engine('handlebars', engine())
app.set('view engine', 'hbs')

// routes
const front = require('./routes/front. routes');
const chat = require('./routes/chat.routes');
const { log } = require('console');
const { EventEmitter } = require('stream');

app.use(front);
app.use(chat);

app.use('/', (req, res, next) => {
    res.redirect('/login')
})

app.use('/', (req, res, next) => {
    res.redirect('/login')
})

// port
const PORT = process.env.PORT || 4000;

// socket io

io.on('connection', async (socket) => {

    const users = await User.find();

    let mapedUsers = users.map((user) => {
        let newUser = {
            ...user._doc
        }
        newUser.status = user.onlineStatus ? 'online' : 'offline'

        return newUser;
    })

    io.emit('user-connected', mapedUsers);


    socket.on('disconnect', async () => {
        console.log('user disconnected');

        const users = await User.find();

        let mapedUsers = users.map((user) => {
            let newUser = {
                ...user._doc
            }
            newUser.status = user.onlineStatus ? 'online' : 'offline'

            return newUser;
        })

        io.emit('user-disconnected', mapedUsers);
    });
    socket.on('get-chat-messages', async (data) => {

        let messages = await Message.find({
            $and: [{
                $or: [
                    { sender: data.currentUser },
                    { sender: data.currentUser }
                ]
            },
            {
                $or: [
                    { receiver: data.currentChatUser },
                    { receiver: data.currentUser }
                ]
            }
            ]
        })
        io.emit('send-chat-messages', messages)

    })
    socket.on('create-chat-message', async (data) => {
        await Message.create(data)

io.emit('reload-chat-messages');
    })
});


// server instances
server.listen(PORT, function () {
    console.log(`Server is listening on ${PORT}`);
})


