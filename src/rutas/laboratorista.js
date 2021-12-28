const express = require('express');
const controlador = require('../controladores/ControladorLaboratorista');
const ruta = express.Router();

ruta.get('/moduloLaboratorista', controlador.login);
ruta.get('/formResultado',controlador.accesarResultado);
ruta.post('/agregarResultado',controlador.ingresarResultado);
ruta.post('/agregarDetalleResultado',controlador.ingresarDetalleResultado);
module.exports = ruta;