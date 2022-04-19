const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();
const secretKey = 'Secret Key';
const { nuevoSkater, getSkaters } = require('../db/querys');


//RUTA RAIZ
router.get('/', async (req, res) => {
    const skaters = await getSkaters();
    res.render('index', {
        layout: 'index',
        skaters: skaters
    })
});
//RUTA REGISTRO
router.get('/registro', (req, res) => {
    res.render('registro', {
        layout: 'registro'
    })
});
//RUTA LOGIN
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'login'
    })
});
//RUTA DATOS
router.get('/datos', (req, res) => {
    res.render('datos', {
        layout: 'datos'
    })
});
//RUTA ADMIN
router.get('/admin', (req, res) => {
    res.render('admin', {
        layout: 'admin'
    })
});

//RUTA OBTENER SKATERS INSCRITOS
router.get('/skater', async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.status = 201;
        res.send(skaters);
    } catch (err) {
        res.status = 500
        console.log(err);
    }
});

//RUTA REGISTRO DE USUARIOS
router.post('/skaters', async (req, res) => {
    const { fotoPerfil } = req.files;
    const { name } = fotoPerfil;
    const { email, nombre, password, passConfirm, aniosExp, especialidad } = req.body;

    if (password !== passConfirm) {
        res.send('<script>alert("Password no coincide");window.location.href="/registro";</script>');
        return false;
    }

    try {
        await nuevoSkater(email, nombre, password, aniosExp, especialidad, name);
        fotoPerfil.mv(path.join(__dirname, '..', 'files', 'imgs', name));
        res.status = 201;
        res.send(`<script>alert("Skater registrado con éxito, Bienvenido ${nombre}");window.location.href="/";</script>`);
    } catch (error) {
        res.status = 500
        res.send('<script>alert("Debe seleccionar una imagen");window.location.href="/registro";</script>');
    }
});

module.exports = router;