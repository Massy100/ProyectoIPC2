const connection = require("express-myconnection");
const req = require("express/lib/request");
const res = require("express/lib/response");

const controlador = {};

controlador.ingresarEmpleado = (req, res) => {
    const dpi = req.body.dpi;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const telefono = req.body.telefono;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO empleado(dpi,nombre,apellido,telefono,correo) VALUES (?,?,?,?,?)', [dpi, nombre, apellido, telefono, email], (err, empleado) => {
            if (!(empleado === undefined)) {
                res.redirect('/moduloAdmin');
            } else {
                res.redirect('/formEmpleado');
            }
        });
    });

}

controlador.asignarUsuario = (req, res) => {

    const usuario = req.body.usuario;
    const password = req.body.password;
    const tipo = req.body.tipo;
    const dpi = req.body.dpi;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO usuario(usuario,password_,tipo,dpi_empleado) VALUES (?,?,?,?)', [usuario, password, tipo, dpi], (err, usuario) => {
            if (!(usuario === undefined)) {
                res.redirect('/moduloAdmin');
            } else {
                res.redirect('/formUsuario');
            }
        });
    });
}

controlador.ingresarMedico = (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const telefono = req.body.telefono;
    const correo = req.body.correo;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO medico VALUES (?,?,?,?,?);', [id, nombre, apellido, telefono, correo], (err, medico) => {
            if (!(medico === undefined)) {
                console.log('***INGRESADO***');
                console.log(medico);
                res.redirect('/moduloAdmin');
            } else {
                console.log('***INGRESADO***');
                res.redirect('/formMedico');
            }
        });
    });
}

controlador.ingresarTipoExamen = (req, res) => {
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    if (!(nombre === '' || precio === '')) {
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO tipo_examen (nombre,precio) VALUES (?,?);', [nombre, precio], (err, tipo) => {
                res.redirect('/moduloAdmin');
            });
        });
    } else {
        res.redirect('/formTipoExamen');
    }
}

controlador.ingresarCampo = (req, res) => {
    const nombre = req.body.nombre;
    const tipo = req.body.tipo_examen;
    if(!(nombre === '')){
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO campo(nombre, id_tipo_examen) VALUES(?,?)', [nombre, tipo], (err, campo) => {
                res.redirect('/moduloAdmin');
            });
        });
    }else{
        res.redirect('/formCampo');
    }
    
}

controlador.editarEmpleado = (req, res) => {
    const dpi = req.body.dpi;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const telefono = req.body.telefono;
    req.getConnection((err, conn) => {
        conn.query('UPDATE empleado SET dpi = ?, nombre =?, apellido =?, telefono=?, correo =? WHERE dpi = ?', [dpi, nombre, apellido, telefono, email, dpi], (err, empleado) => {
            if (!(empleado === undefined)) {
                res.redirect('/vistaEmpleados');
            } else {
                res.redirect('/vistaEmpleados');
            }
        });
    });
}

controlador.eliminarEmpleado = (req, res) => {
    const dpi = req.params.dpi;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM usuario WHERE dpi_empleado = ?', dpi, (err, user) => {
            conn.query('DELETE FROM empleado WHERE dpi = ?', dpi, (err, empleado) => {
                res.redirect('/vistaEmpleados');
            });
        });
    });
}

controlador.editarMedico = (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const telefono = req.body.telefono;
    const correo = req.body.correo;
    req.getConnection((err, conn) => {
        conn.query('UPDATE medico SET id_medico = ?, nombre = ?, apellido =?, telefono =?, correo =? WHERE id_medico = ?', [id, nombre, apellido, telefono, correo, id], (err, medico) => {
            if (!(medico === undefined)) {
                res.redirect('/vistaMedicos');
            } else {
                res.redirect('/vistaMedicos');
            }
        });
    });
}

controlador.consultarGanancias = (req, res) => {
    const fecha1 = req.body.fecha1;
    const fecha2 = req.body.fecha2;

    req.getConnection((err, conn) => {
        conn.query('SELECT id_examen, fecha, total FROM pago WHERE fecha BETWEEN ? AND ?;', [fecha1, fecha2], (err, datos) => {

            if (!(datos === undefined)) {
                res.render('vistaGanancias', {
                    ganancias: datos
                });
            } else {
                res.redirect('/formReporteGanancias');
            }
        });
    });
}

controlador.consultarExamenesReferidos = (req, res) => {
    const fecha1 = req.body.fecha1;
    const fecha2 = req.body.fecha2;

    req.getConnection((err, conn) => {
        conn.query('SELECT examen.id_examen as idExamen, medico.nombre as nombreMedico, medico.apellido as apellidoMedico, medico.correo as correoMedico FROM examen INNER JOIN 	medico ON examen.id_medico = medico.id_medico WHERE examen.id_medico > 0 AND examen.fecha BETWEEN ? AND ?;', [fecha1, fecha2], (err, datos) => {
            if (!(datos === undefined)) {
                res.render('vistaExamenesReferidos', {
                    examenes: datos
                });
            }
        });
    });
}

controlador.accesarFormExamenes = (req, res) => {
    res.render('ingresarFormExamenes');
}

controlador.accesarFormGanancias = (req, res) => {
    res.render('ingresarFormGanancias');
}

controlador.accesarEmpleado = (req, res) => {
    res.render('ingresarEmpleado');
}

controlador.accesarUsuario = (req, res) => {
    res.render('asignarUsuario');
}

controlador.accesarMedico = (req, res) => {
    res.render('ingresarMedico');
}

controlador.accesarEmpleados = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM empleado;', (err, datos) => {
            res.render('empleados', {
                empleados: datos
            });
        });
    });
}

controlador.accesarMedicos = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM medico;', (err, datos) => {
            res.render('medicos', {
                medicos: datos
            });
        });
    });
}

controlador.accesarTipoExamen = (req, res) => {
    res.render('ingresarTipoExamen');
}

controlador.accesarCampo = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tipo_examen', (err, tipos) => {
            res.render('ingresarCampo', {
                tipo: tipos
            });
        });
    });
}

controlador.accesarEditarempleado = (req, res) => {
    const dpi = req.params.dpi;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM empleado WHERE dpi = ? ', dpi, (err, datos) => {
            res.render('editarEmpleado', {
                empleado: datos[0]
            });
        });
    });
}

controlador.accesarEditarMedico = (req, res) => {
    const id = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM medico WHERE id_medico = ?', id, (err, datos) => {
            res.render('editarMedico', {
                medico: datos[0]
            });
        });
    });
}

controlador.accesarReportes = (req, res) => {
    res.render('moduloReportes');
}

controlador.login = (req, res) => {
    res.render('moduloAdministrador');
}

module.exports = controlador;