//IMPORTACION
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const secretKey = 'Secret Key';
const { getSkaters,
    getAdmin,
    nuevoSkater,
    setSkaterStatus,
    getSkater,
    updateSkater,
    deleteSkater } = require('../db/querys');

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
    });
});
//RUTA DATOS
router.get('/datos', (req, res) => {
    const { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        const { data } = decoded;
        const { id, email, nombre, password, anos_experiencia, especialidad, foto } = data;
        const datos = { id, email, nombre, password, anos_experiencia, especialidad, foto }
        err ? res.status(401).send(
            res.send({
                error: '401 Unauthorized',
                message: 'No estás autorizado para estar aquí!',
                token_error: err.message,
            })
        )
            : res.render('datos', {
                layout: 'datos',
                datos: datos
            });
    })
});
//RUTA ADMIN
router.get('/admin', async (req, res) => {
    try {
        res.render('loginAdmin', {
            layout: 'loginAdmin',
        })
    } catch (err) {
        res.status = 500;
        res.send('Algo salió mal', err);
    }
});
//RUTA ADMIN
router.get('/panel-admin', async (req, res) => {
    const { token } = req.query;
    const skaters = await getSkaters();
    jwt.verify(token, secretKey, (err, decoded) => {
        const { data } = decoded;
        err ? res.status(401).send(
            res.send({
                error: '401 Unauthorized',
                message: 'No estás autorizado para estar aquí!',
                token_error: err.message,
            })
        )
            : res.render('admin', {
                layout: 'admin',
                skaters: skaters
            })
    })
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
//RUTA REGISTRO DE SKATERS
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
//VERIFICACION SKATER
router.post('/verify', async (req, res) => {
    const { email, password } = req.body;
    const skater = await getSkater(email, password);
    if (skater) {
        if (skater.estado) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 120,
                    data: skater,
                },
                secretKey
            );
            res.send(token);
        } else {
            res.status(401).send({
                error: "Skater aún no se encuentra aprobado",
                code: 401
            });
        }
    } else {
        res.status(401).send({
            error: "Skater no se encuentra registrado en la base de datos",
            code: 401
        });
    }
});
//ACTUALIZACION DATOS
router.put('/datos', async (req, res) => {
    const { id, nombre, password, anos_experiencia, especialidad } = req.body;
    try {
        const response = await updateSkater(id, nombre, password, anos_experiencia, especialidad);
        res.status(201).send(response);
    } catch (error) {
        res.status(500).send({
            error: 'No se pudo realizar la actualización',
            code: 500
        })

    }
});
//ELIMINAR USUARIO
router.delete('/datos', async (req, res) => {
    const { id, foto } = req.query;
    try {
        await fs.unlink(path.join(__dirname, '..', 'files', 'imgs', `${foto}`));
        const response = await deleteSkater(id);
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({
            error: 'No se pudo eliminar al skater',
            code: 500
        })
    }
})
//VERIFICACIÓN ADMIN
router.post('/verify-admin', async (req, res) => {
    const { user, password } = req.body;
    const admin = await getAdmin(user, password);
    if (admin) {
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 120,
                data: admin,
            },
            secretKey
        );
        res.send(token);
    } else {
        res.status(401).send({
            error: "Usuario no habilitado",
            code: 401
        });
    }
});

module.exports = router;