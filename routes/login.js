var express = require('express'),
    session = require('express-session');

var User = require('../models/user');

var router = express.Router();

router.get('/', function(req, res) {
    if (req.session.username) {
        return res.redirect('/upload');
    }
    res.render('login', { err:false });
});



module.exports = router;
