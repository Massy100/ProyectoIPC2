const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const conexion = require('express-myconnection');
const app = express();

//IMPORTANDO RUTAS
const rutas = require('./rutas/secretaria');
const rutasAdmin = require('./rutas/administrador');
const rutasLab = require('./rutas/laboratorista');
//const rutasVenta = require('./rutas/administrador');
const { urlencoded } = require('express');

//settings
app.set('port', process.env.PORT || 4000); //puerto
app.set('view engine', 'ejs'); // indicamos que usaremos ejs como motor de plantilla
app.set('views', path.join(__dirname, 'views'));


//middlewares
app.use(morgan('dev'));
app.use(conexion(mysql, {
  host: 'localhost',
  user: 'administrador',
  password: 'administradorsql',
  port: 3306,
  database: 'laboratorio_patito'
}, 'single'));

app.use(express.urlencoded({ extended: false })); //para entender todos los datos que vengan del formulario, recibe solo texto

//rutas
app.use('/', rutas);
app.use('/', rutasAdmin);
app.use('/', rutasLab);
//app.use('/',rutasP);
//app.use('/',rutasVenta);
app.use(express.static('public'));
//app.use('/img',express.static(__dirname+'../public/img'));


//static files
//app.use(express.static(path.join(__dirname,'public')));

//INICIANDO SERVIDOR
app.listen(app.get('port'), () => {
  console.log('Server on port 4000');
});