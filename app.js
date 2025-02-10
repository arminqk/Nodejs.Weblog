const express = require('express');
const path = require('path');
const pug = require('pug'); // Explicitly require Pug
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');




mongoose.connect(config.database);
let db = mongoose.connection;
//check db error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//check connection
db.once('open', () => {console.log('MongoDB connection successful!')});





// init
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//





// public folder

app.use(express.static(path.join(__dirname, 'public')));



//models
let Article = require('./models/article');
const session = require("express-session");



//debug
console.log("views directory" , path.join(__dirname, 'views'));

//load view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Express Validator Middleware
app.use(expressValidator({
    errorFormatter : function (param,msg,value){
        var namespace = param.split('.'),
            root = namespace.shift(),
            formparam = root;
        while (namespace.length)
        {
            formparam += '[' + namespace.shift()+']';
        }
        return{
            param : formparam,
            msg : msg,
            value : value
        }
    }
}));


//passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*' , (req, res , next) => {
    res.locals.user = req.user || null;
    next();
})

//Home Route
app.get('/', function (req, res)
{
    Article.find({} , function (err, articles)

    {
        res.render('index' , {
        title:'Article',
            articles:articles
    });
    });

});

// router files
let article = require('./routes/article');
let User = require('./routes/users');
app.use('/article' , article);
app.use('/users' , users);





//start server
app.listen(3000 , function()
{
    console.log('Server is running on https://localhost:3000');
});

