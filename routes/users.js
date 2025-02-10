const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');

let User = require('../models/User');

//register form

router.get('/register', (req, res) => {
    res.render('register');
})
//reg process
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    req.checkBody('name').notEmpty();
    req.checkBody('email').isEmail();
    req.checkBody('password').notEmpty();
    req.checkBody('username').notEmpty();


    let errors = req.validationErrors();

    if(errors){
        res.render('register', {errors: errors});
    }
    else {
        let newUser = new User({
            name: name,
            email: email,
            password: password,
            username: username,
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) return console.log(err);

                newUser.password = hash;
                newUser.save(function(err) {
                    if (err) return console.log(err);
                    else {
                        req.flash('success', 'User saved successfully.');
                        res.redirect('/users/login');
                    }
                });
            })
        })
    }
})
//login form
router.get('/login', (req, res) => {
    res.render('login');
})

//login process
router.post('/login', (req, res , next) => {
    passport.authenticate('local', (err, user, info) => {
        succcessRedirect = '/';
        failureRedirect = 'users/login';
        failureflash : true;
    })(req, res , next);
})


//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'User logged out');
    res.redirect('users/login');
})

module.exports = router;