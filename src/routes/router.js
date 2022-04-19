const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();
const secretKey = 'Secret Key';
const { nuevoSkater, getSkaters, setSkaterStatus } = require('../db/querys');

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
router.get('/admin', async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.render('admin', {
            layout: 'admin',
            skaters: skaters
        })
    } catch (err) {
        res.status = 500;
        res.send('Algo salió mal', err);
    }

});
//RUTA OBTENER SKATERS INSCRITOS
router.get('/skaters', async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.status = 201;
        res.send(skaters);
    } catch (err) {
        res.status = 500
        res.send('Algo salió mal', err);
    }
});
//RUTA REGISTRO DE USUARIOS
router.post('/skater', async (req, res) => {
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
//RUTA STATUS SKATER
router.put('/skater', async (req, res) => {
    const { id, estado } = req.body;
    try {
        const skater = await setSkaterStatus(id, estado);
        res.status(200).send(skater);
    } catch (err) {
        res.status(500).send({
            error: `Algo salio mal ... ${err}`,
            code: 500
        });
    }
});

module.exports = router;