const express = require('express')
const router = express.Router()


const passport = require('passport')
const { isLoggedIn, isNotLoggedIn} = require('../lib/auth')

router.get('/index', isNotLoggedIn , (req, res) => {
    res.render('auth/index')
})

router.post('/singup', passport.authenticate('local.singup', {
    successRedirect: '/profile',
    failureRedirect: '/index',
    failureFlash: true

}))

router.post('/login', (req, res, next) => {
    passport.authenticate('local.login',{
    successRedirect: '/profile',
    failureRedirect: '/index',
    failureFlash: true
    })(req, res, next)
})

router.get('/profile', isLoggedIn , (req, res) => {
    res.render('profile')
})

router.get('/signout', (req, res) => {
    req.logOut()
    res.redirect('/index')
})

module.exports = router