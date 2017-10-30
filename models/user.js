var mongoose    = require('mongoose'),
    bcrypt      = require('bcrypt');

var SALT_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours


var user_model = mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    login_attempts: {type: Number, required: true, default: 0},
    lock_until: {type: Number}

});

user_model.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified or is new
    if (!user.isModified('password')) return next();

    // generate salt
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        }) ;
    });
});

user_model.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

user_model.methods.incLoginAttempts = function(cb) {
    //if previous lock has expired, reset
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: {loginAttempts: 1},
            $unset: {lockUntil: 1}
        }, cb);
    }
    // otherwise increment
    var updates = {$inc: {loginAttempts: 1}};
    // if we've reached max attempts, lock
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = {lockUntil: Date.now() + LOCK_TIME};
    }
    return this.update(updates, cb);
}

user_model.virtual('isLocked').get(function() {
    return !!(this.lock_until && this.lock_until > Date.now());
});

user_model.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({username: username}, function(err, user) {
        if (err) {
            return cb(err);
        }
        // user doesnt exist
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }
        // account is locked
        if (user.isLocked) {
            return user.incLoginAttempts(function(err) {
                if (err) {
                    return cb(err);
                }
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }
        // test password
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            // passwords match
            if (isMatch) {
                // no lock on account or failed attempts, return user
                if (!user.loginAttempts && !user.lockUntil) {
                    return cb(null, user);
                }
                // for resetting attempts and lock info
                var updates = {
                    $set: {loginAttempts: 0},
                    $unset: {lockUntil: 1}
                };
                return user.update(updates, function(err) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null, user);
                });
            }
            // incorrect password, increment failed attempts
            user.incLoginAttempts(function(err) {
                if (err) {
                    return cb(err);
                }
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

var reasons = user_model.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

var User = mongoose.model('User', user_model);

module.exports = User;



// sample User creation/saving to db
// var testUser = new User({
//     username: 'test_user',
//     password: 'password'
// });

// simple save test
// testUser.save(function(err) {
//     if (err) throw err;

//     // authenticate user
//     User.getAuthenticated('jmar777', 'Password123', function(err, user, reason) {
//         if (err) {
//             throw err;
//         }

//         // login was successful
//         if (user) {
//             // handle login success
//             console.log('login success');
//             return;
//         }

//         // otherwise we can determine why we failed
//         var reasons = User.failedLogin;
//         switch (reason) {
//             case reasons.NOT_FOUND:
//             case reasons.PASSWORD_INCORRECT:
//                 break;
//             case reasons.MAX_ATTEMPTS:
//                 // send email or otherwise notify user that account is
//                 // temporarily locked
//                 break;
//         }
//     });
// });
