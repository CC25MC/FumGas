const express = require('express')
const router = express.Router()

const poll = require('../database')
const { isLoggedIn} = require('../lib/auth')


router.get('/register_client', isLoggedIn, (req, res) => {
    res.render('links/register_client')
})

router.post('/register_client', async (req, res) => {
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

    const newClient = {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono
    }
    await poll.query('INSERT INTO direccion set ?', [newDirecction])
    await poll.query('INSERT INTO clientes set ?', [newClient])
    req.flash('success', 'Cliente Registrado Con Exito')
    res.redirect('./view_client')
})

router.get('/view_users', isLoggedIn, async (req, res) => {
    const users = await poll.query('SELECT * FROM users')
    res.render('links/view_users', {
        users
    })
})

router.get('/view_client', isLoggedIn, async (req, res) => {
    const client = await poll.query('SELECT * FROM clientes')
    res.render('links/view_client', {
        client
    })
})

router.get('/delete/:Id_users', isLoggedIn, async (req, res) => {
    const {
        Id_users
    } = req.params
    await poll.query('DELETE FROM users WHERE Id_users = ?', Id_users)
    req.flash('success', 'Usuario Eliminado Con Exito')
    res.redirect('../view_users')
})

router.get('/delet/:idCliente', isLoggedIn, async (req, res) => {
    const {
        idCliente
    } = req.params
    await poll.query('DELETE FROM clientes WHERE idCliente = ?', idCliente)
    req.flash('success', 'Cliente Eliminado Con Exito')
    res.redirect('../view_client')
})

router.get('/edit/:Id_users', isLoggedIn, async (req, res) => {
    const {
        Id_users
    } = req.params
    const user = await poll.query('SELECT * FROM users WHERE Id_users = ?', Id_users)
    res.render('links/edit', {
        user: user[0]
    })
})

router.get('/edit_client/:idCliente', isLoggedIn, async (req, res) => {
    const {
        idCliente
    } = req.params
    const client = await poll.query('SELECT * FROM clientes WHERE idCliente = ?', idCliente)
    res.render('links/edit_client', {
        client: client[0]
    })
})

router.get('/client', isLoggedIn, (req, res) => {
    res.render('links/client')
})

router.post('/client',  async (req, res) => {
    const {
        Cedula
    } = req.body
    const client = await poll.query('SELECT * FROM clientes WHERE Cedula = ?', Cedula)
    res.render('links/client', {
        client
    })
})

router.post('/edit/:Id_users', async (req, res) => {
    const {
        Id_users
    } = req.params
    const {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono
    } = req.body

    const newUserEdit = {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono
    }
    await poll.query('UPDATE users set ? WHERE Id_users = ?', [newUserEdit, Id_users])
    req.flash('success', 'Usuario Actualizado Con Exito')
    res.redirect('../view_users')
})

router.post('/edit_client/:idCliente', async (req, res) => {
    const {
        idCliente
    } = req.params
    const {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono
    } = req.body

    const newclientEdit = {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono
    }
    await poll.query('UPDATE clientes set ? WHERE idCliente = ?', [newclientEdit, idCliente])
    req.flash('success', 'Cliente Actualizado Con Exito')
    res.redirect('../view_client')
})

module.exports = router