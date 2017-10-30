var express = require('express'),
    session = require('express-session');

var User = require('../models/user');

// TODO: should implement a better way to require admin approval to create a new account
var ADMIN_PW = "admin";

var router = express.Router();


router.post('/logout', function(req, res) {
    req.session.destroy();
    return res.redirect('/upload');
});

router.post('/login', function(req, res) {
    console.log("entering login POST");
    if (!req.body.username || !req.body.password) {
        return res.render('login', { err: true, msg: "Please enter both user name and password" });
    }
    User.getAuthenticated(req.body.username, req.body.password, function(err, user, reason) {
        if (err) {
            console.log('err in log in, authetication');
            return res.render('login', { err: true, msg: err });
        }
        if (user) {
            //do session stuff here
            req.session.username = req.body.username;
            return res.redirect('/upload');
        }
        // TODO: need logic to handle incorrect login and too many login attempts
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
            case reasons.MAX_ATTEMPTS:
        }
        return res.render('login', { err: true, msg: "Login Unsuccesful" });
    });
});

router.post('/signup', function(req, res) {

    if (!req.body.username || !req.body.password || !req.body.adminpw) {
        return res.render('signup', { err: true, msg: "Please complete all fields" });
    }

    // check if username is taken
    User.findOne({username: req.body.username}, function(err, user) {
        // TODO: not sure what kind of error would be thrown here, just return to user and log to console for now
        if (err) {
            return res.render('signup', { err: true, msg: err });
        }
        // user name taken
        if (user) {
            return res.render('signup', { err: true, msg: "That username is not available." });
        }
    });

    if (req.body.adminpw !== ADMIN_PW) {
            return res.render('signup', { err: true, msg: "Admin password incorrect." });
    }

    // create new user and save
    var newuser = new User({
        username: req.body.username,
        password: req.body.password
    });

    newuser.save(function(err) {
        // TODO: not sure what kind of error would be thrown here, just return to user and log to console for now
        if (err) {
            console.log('err in signup: ', err);
            return res.render('signup', { err: true, msg: err });
        }
        req.session.username = req.body.username;
        return res.redirect('/upload');
    });
});


module.exports = router;
