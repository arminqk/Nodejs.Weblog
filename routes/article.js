const express = require('express');
const router = express.Router();


//bring in article model
let Article = require('../models/article');
const session = require("express-session");

//user model
let User = require('../models/user');

//single Article
router.get('/add', ensureAuthenticated,function (req, res){
    Article.findById(req.params.id, function (err, articles)
    {
        User.findById(article.author, function (err, article) {
            res.render('article', {
            articles: articles ,
                author : user.name
        })
        })

    })

})


//update submit
router.post('/edit', ensureAuthenticated,function (req, res){
   let article = {};
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;

    let query = req.query;
   Article.update(query ,article ,function (err){
       if (err){
           console.log(err);
           return;
       }else {
           res.flash('Successfully update article!');
           res.redirect('/');
       }
   })
});

// Delete article
router.delete('/:id',function (req, res){
    if(!req.user._id)
    {
        res.status(500).send('Not Found!');
    }
    let query = {id: req.params.id};
    Article.findById(req.params.id, function (err, article){
        if(article.author !== req.user._id){
            res.status(500).send('Not Found!');
        }
        else{
            Article.remove(query ,function (err){
        if (err){
            console.log(err);
        }
        res.send('Successfully deleted article!');
    })
        }
    })

})

//Express Session Middleware
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {secure: true},
}))

//Express Messages Middleware
router.use(require('connect-flash')());
router.use(function(req,res,next){
    res.locals.message = require('express-messages')(req, res);
    next();
})

//load Edit
router.get('/edit/:id',function (req, res) {
    Article.findById(req.params.id, function (err, articles) {
        if(article.author !== req.user._id){
            req.flash('warning','You do not have permission to edit this article!');
            res.redirect('/');
        }
        res.render('edit_article', {
            articles: articles
        })
    })
})



//routes
router.get('/add', ensureAuthenticated,function (req, res)
{
    res.render('add_article');
});


//add submit post
router.post('article/add', ensureAuthenticated,function (req, res){
    req.checkBody('title').notEmpty();
    //req.checkBody('author').notEmpty();
    req.checkBody('body').notEmpty();

    //get errors
    let errors = req.validationErrors();

    if (errors)
    {
        res.render('add_article', {
            title: 'Add new article!',
            errors: errors
        })
    }
    else{
        let article = new Article();
        req.checkBody('title').notEmpty();
        req.checkBody('author').notEmpty();
        req.checkBody('body').notEmpty();
    }

    let article = new Article(req.body);
   article.title = req.body.title;
   article.author = req.user._id;
   article.body = req.body.body;

   article.save(function (err){
       if (err){
           console.log(err);
           return;
       }else {
           res.flash('Successfully added article!');
           res.redirect('/');
       }
   })
});

//Access Control
function ensureAuthenticated (req, res, next){
    if (req.isAuthenticated()){
        return next();

    }
    else{
        req.flash('error','You are not logged in!');
        res.redirect('/users/login');
    }
}




module.exports = router;