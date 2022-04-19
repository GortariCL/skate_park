//IMPORTACIONES
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const expressFileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const port = 3000;

//SETTINGS
const configFileUpload = {
    limits: { fileSize: 10000000 },
    abortOnLimit: true,
    responseOnLimits: 'Ha superado el limite en el tamaño de la imagen'
}
//INTEGRACION MOTOR DE PLANTILLAS
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views', 'layouts'));
//CONFIGURACION HANDLEBARS
app.engine(
    'handlebars',
    exphbs.engine({
        helpers: {
            inc: (value, option) => {
                return parseInt(value) + 1;
            }
        },
        defaultLayout: 'main',
        layoutsDir: app.get('views'),
        partialsDir: path.join(__dirname, '..', '/views/components/')
    })
);
//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//EXPRESS UPLOAD
app.use(expressFileUpload(configFileUpload));
//IMGS
app.use('/imgs', express.static(path.join(__dirname, '..', 'files', 'imgs')));
//BOOTSTRAP CSS
app.use('/css', express.static(path.join(__dirname, '..', '..', 'node_modules', 'bootstrap', 'dist', 'css')));
//BOOTSTRAP JS
app.use('/js', express.static(path.join(__dirname, '..', '..', 'node_modules', 'bootstrap', 'dist', 'js')));
//ASSETS
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
//JQUERY
app.use('/jquery', express.static(path.join(__dirname, '..', '..', 'node_modules', 'jquery')));
//AXIOS
app.use('/axios', express.static(path.join(__dirname, '..', '..', 'node_modules', 'axios')));
//ROUTES
app.use(require('../routes/router'));
//LISTEN SERVER
app.listen(port, console.log(`SERVER ON => ${port}`));