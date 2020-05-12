const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const poll = require('../database')
const helpers = require('../lib/helpers')

passport.use('local.login', new LocalStrategy({

    usernameField: 'Username',
    passwordField: 'Password',
    passReqToCallback: true

}, async (req, Username, Password, done) => {

    const rows = await poll.query('SELECT * FROM users WHERE Username = ?', [Username])
    if(rows.length > 0){
        const user = rows[0]
        const validPassword = await helpers.machPassword(Password, user.Password)
        if(validPassword){
            done(null, user, req.flash('success','Welcome'+ user.Username))
        }else{
            done(null, false, req.flash('mensaje','Incorret Password'))
        }

    }else{
        return done(null, false, req.flash('mensaje','Incorret Username'))
    }
}))

passport.use('local.singup', new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
    passReqToCallback: true
}, async (req, Username, Password, done) => {
    const {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono,
        Estado,
        Municipio,
        Ciudad
    } = req.body
    const newDirecction = {
        Estado,
        Municipio,
        Ciudad
    }

    const newUser = {
        Username,
        Password,
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono,
    }
    newUser.Password = await helpers.encriptPassword(Password)
    const resul = await poll.query('INSERT INTO direccion set ?', [newDirecction])
    newUser.Direccion_idDireccion = resul.insertId
    const result = await poll.query('INSERT INTO users set ?', [newUser])
    newUser.Id_users = result.insertId

    return done(null, newUser)
}))

passport.serializeUser((user, done) => {
    done(null, user.Id_users)
})

passport.deserializeUser(async (Id_users, done) => {
    const row = await poll.query('SELECT * FROM users WHERE Id_users = ?', [Id_users])
    done(null, row[0])
})