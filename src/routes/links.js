const express = require('express')
const router = express.Router()

const poll = require('../database')
const {
    isLoggedIn
} = require('../lib/auth')


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
    const result = await poll.query('INSERT INTO direccion set ?', [newDirecction])
    newClient.Direccion_idDireccion = result.insertId
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
    const result = await poll.query('SELECT * FROM users WHERE Id_users = ?', Id_users)
    const direccion = result[0].Direccion_idDireccion
    await poll.query('DELETE FROM users WHERE Id_users = ?', Id_users)
    await poll.query('DELETE FROM direccion WHERE idDireccion = ?', direccion)
    req.flash('success', 'Usuario Eliminado Con Exito')
    res.redirect('../view_users')
})

router.get('/delet/:idCliente', isLoggedIn, async (req, res) => {
    const {
        idCliente
    } = req.params
    const result = await poll.query('SELECT * FROM clientes WHERE idCliente = ?', idCliente)
    const direccion = result[0].Direccion_idDireccion
    await poll.query('DELETE FROM clientes WHERE idCliente = ?', idCliente)
    await poll.query('DELETE FROM direccion WHERE idDireccion = ?', direccion)
    console.log(direccion)
    req.flash('success', 'Cliente Eliminado Con Exito')
    res.redirect('../view_client')
})

router.get('/edit/:Id_users/:Direccion_idDireccion', isLoggedIn, async (req, res) => {
    const {
        Id_users
    } = req.params
    const user = await poll.query('SELECT * FROM users WHERE Id_users = ?', Id_users)
    const direccion = await poll.query('SELECT * FROM direccion WHERE idDireccion = ?', user[0].Direccion_idDireccion)
    user[0].Estado = direccion[0].Estado
    user[0].Municipio = direccion[0].Municipio
    user[0].Ciudad = direccion[0].Ciudad
    res.render('links/edit', {
        user: user[0]
    })
})

router.get('/edit_client/:idCliente/:Direccion_idDireccion', isLoggedIn, async (req, res) => {
    const {
        idCliente
    } = req.params
    const client = await poll.query('SELECT * FROM clientes WHERE idCliente = ?', idCliente)
    const direccion = await poll.query('SELECT * FROM direccion WHERE idDireccion = ?', client[0].Direccion_idDireccion)
    client[0].Estado = direccion[0].Estado
    client[0].Municipio = direccion[0].Municipio
    client[0].Ciudad = direccion[0].Ciudad
    res.render('links/edit_client', {
        client: client[0]
    })
})

router.get('/client', isLoggedIn, (req, res) => {
    res.render('links/client')
})

router.post('/client', async (req, res) => {
    const {
        Cedula
    } = req.body

    const client = await poll.query('SELECT * FROM clientes WHERE Cedula = ?', Cedula)
    if (client[0]) {
        const direccion = await poll.query('SELECT * FROM direccion WHERE idDireccion = ?', client[0].Direccion_idDireccion)
        client[0].Estado = direccion[0].Estado
        client[0].Municipio = direccion[0].Municipio
        client[0].Ciudad = direccion[0].Ciudad
        res.render('links/client', {
            client
        })
    } else {
        req.flash('mensaje', 'Usuario No encontrado')
        res.redirect('/links/view_client')
    }

})

router.post('/edit/:Id_users/:Direccion_idDireccion', async (req, res) => {
    const {
        Id_users,
        Direccion_idDireccion
    } = req.params
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

    const newUserEdit = {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono
    }
    const newDirecction = {
        Estado,
        Municipio,
        Ciudad
    }
    await poll.query('UPDATE direccion set ? WHERE idDireccion = ?', [newDirecction, Direccion_idDireccion])
    await poll.query('UPDATE users set ? WHERE Id_users = ?', [newUserEdit, Id_users])

    req.flash('success', 'Usuario Actualizado Con Exito')
    res.redirect('../../view_users')
})

router.post('/edit_client/:idCliente/:Direccion_idDireccion', async (req, res) => {
    const {
        idCliente,
        Direccion_idDireccion
    } = req.params
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

    const newclientEdit = {
        Cedula,
        Nombre,
        Apellido,
        Email,
        Telefono
    }

    const newDirecction = {
        Estado,
        Municipio,
        Ciudad
    }
    await poll.query('UPDATE direccion set ? WHERE idDireccion = ?', [newDirecction, Direccion_idDireccion])
    await poll.query('UPDATE clientes set ? WHERE idCliente = ?', [newclientEdit, idCliente])
    req.flash('success', 'Cliente Actualizado Con Exito')
    res.redirect('../../view_client')
})

router.get('/providers', isLoggedIn, (req, res) => {
    res.render('links/providers')
})

router.post('/providers', async (req, res) => {
    const {
        Rif,
        Nombre,
        NombreP,
        Descripcion,
        Telefono,
        Marca,
        Precio,
        Email,
        Stock
    } = req.body
    const newProduct = {
        NombreP,
        Descripcion,
        Marca,
        Precio,
        Stock
    }

    const newProvider = {
        Rif,
        Nombre,
        Email,
        Telefono
    }
    const result = await poll.query('INSERT INTO productos set ?', [newProduct])
    await poll.query('INSERT INTO proveedores set ?', [newProvider])
    req.flash('success', 'Proveedor Registrado Con Exito')
    res.redirect('./view_client')
})

router.get('/show_providers', isLoggedIn, async (req, res) => {
    const providers = await poll.query('SELECT * FROM proveedores')
    res.render('links/show_providers', {
        providers
    })
})

router.get('/edit_providers/:idProveedores', isLoggedIn, async (req, res) => {
    const {
        idProveedores
    } = req.params
    const providers = await poll.query('SELECT * FROM proveedores WHERE idProveedores = ?', idProveedores)
    res.render('links/edit_providers', {
        providers: providers[0]
    })
})

router.post('/edit_providers/:idProveedores', async (req, res) => {
    const {
        idProveedores
    } = req.params
    const {
        Rif,
        Nombre,
        Email,
        Telefono
    } = req.body

    const newprovidersEdit = {
        Rif,
        Nombre,
        Email,
        Telefono
    }
    await poll.query('UPDATE proveedores set ? WHERE idProveedores = ?', [newprovidersEdit, idProveedores])
    req.flash('success', 'Proveedor Actualizado Con Exito')
    res.redirect('../show_providers')
})

router.post('/searchProviders', async (req, res) => {
    const {
        Rif
    } = req.body
    const providers = await poll.query('SELECT * FROM proveedores WHERE Rif = ?', Rif)

    if(providers[0]){
        res.render('links/show_providers', {
            providers
        })
    }else{
        req.flash('mensaje', 'Proveedor No encontrado')
        res.redirect('/links/show_providers')
    }
})

router.get('/delete_providers/:idProveedores', isLoggedIn, async (req, res) => {
    const {
        idProveedores
    } = req.params

    await poll.query('DELETE FROM proveedores WHERE idProveedores = ?', idProveedores)
    
    req.flash('success', 'Cliente Eliminado Con Exito')
    res.redirect('../show_providers')
})
module.exports = router