const router = require('express').Router();
const User = require('../models/User');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/login', isLoggedOut,(req, res, next) => {
    res.render('auth/login.hbs');
});

router.get('/signup', isLoggedOut,(req, res, next) => {
    res.render('auth/signup.hbs');
});

router.post('/login', isLoggedOut,(req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/login.hbs', {errorMessage: "Enter both username and password"})
    }
    else {
        User.findOne({username})
        .then((user) => {
            if (user && bcryptjs.compareSync(password, user.password)) {
                req.session.user = user;
                res.redirect('/');
            }
            else {
                res.render('auth/login.hbs', {errorMessage: "Incorrect username/password"});
            }
        })
        .catch((err) => {
            next(err);
        });
    }
});

router.post('/signup', isLoggedOut,(req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/signup.hbs', {errorMessage: "All fields are mandatory"});
    }
    else {
        User.findOne({username})
        .then((foundUser) => {
            if (!foundUser) {
                bcryptjs
                .genSalt(saltRounds)
                .then((salt) => {
                    return bcryptjs.hash(password, salt);
                })
                .then((saltedPassword) => {
                    return User.create({
                        username,
                        password: saltedPassword
                    })
                })
                .then((createdUser) => {
                    req.session.user = createdUser;
                    res.redirect('/');
                })
                .catch((err) => {
                    next(err);
                });
            }
            else {
                res.render('auth/signup.hbs', {errorMessage: "Username taken"});
            }
        })
        .catch((err) => {
            next(err);
        });
    }
});

router.get('/logout', isLoggedIn,(req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        next(err);  
      }
      res.redirect('/');
    });
});

module.exports = router;
