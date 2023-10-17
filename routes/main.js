const router = require('express').Router();
const { isLoggedIn } = require('../middleware/route-guard');

router.get('/', isLoggedIn, (req, res, next) => {
    res.render('main/main.hbs');
});

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('main/private.hbs');
});

module.exports = router;
