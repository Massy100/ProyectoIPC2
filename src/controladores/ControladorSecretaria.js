const req = require("express/lib/request");
const res = require("express/lib/response");

const controlador = {};

controlador.login = (req, res) => {
    res.render('index');
}
/*ESTE ACCESAR ES PARA VALIDAR LOS TIPOS DE USUARIOS...
NO ES UNA ACCION PROPIA DE LA SECRETARIA PERO LO AGREGUE EN ESTE CONTROLADOR...*/
controlador.accesar = (req, res) => {
    const usuario = req.body.usuario;
    const password = req.body.password;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE usuario.usuario = ? AND password_ = ?;', [usuario, password], (err, user) => {
            if (!(user[0] === undefined)) {
                if (user[0].tipo === 1) {
                    res.render('moduloAdministrador');
                } else if (user[0].tipo === 2) {
                    res.render('moduloSecretaria');
                } else if (user[0].tipo === 3) {
                    res.render('moduloLaboratorista');
                }
            } else {
                res.redirect('/');
            }
        });
    });
};

/*FIN-------------*/

controlador.ingresarPaciente = (req, res) => {
    const cui = req.body.cui;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const sexo = req.body.sexo;
    const fecha = req.body.fecha;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO paciente VALUES (?,?,?,?,?);', [cui, nombre, apellido, sexo, fecha], (err, paciente) => {
            if (!(paciente === undefined)) {
                console.log('*****INGRESADO****');
                console.log(paciente);
                res.redirect('/moduloSecretaria');
            } else {
                console.log('***ERROR AL INGRESAR***');
                res.redirect('/formPaciente');
            }

        });
    });
}

controlador.ingresarExamen = (req, res) => {
    const id = req.body.id;
    const cui = req.body.cui;
    const id_medico = req.body.medico;
    const fecha = req.body.fecha;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM paciente WHERE cui = ?', cui, (err, paciente) => {
            if (!(paciente[0] === undefined)) {
                conn.query('SELECT * FROM medico WHERE id_medico = ?', id_medico, (err, medico) => {
                    if (!(medico[0] === undefined)) {
                        conn.query('INSERT INTO examen(id_examen,paciente_cui,id_medico,fecha,total) VALUES (?,?,?,?,?);', [id, cui, id_medico, fecha, 0.0], (err, examen) => {
                            if (!(examen === undefined)) {
                                console.log('***INGRESADO***');
                                ;
                                conn.query('SELECT * FROM tipo_examen;', (err, tipos) => {
                                    res.render('ingresarDetalleExamen', {
                                        tipoExamen: tipos,
                                        examen: id
                                    });
                                });

                            } else {
                                console.log('***ERROR***');
                                res.redirect('/formExamen');
                            }
                        });
                    } else {
                        console.log('****EL MEDICO NO EXISTE***');
                        res.redirect('/formExamen');
                    }
                });
            } else {
                console.log('****EL PACIENTE NO EXISTE***');
                res.redirect('/formExamen');
            }
        });

    });
}

controlador.ingresarDetalleExamen = (req, res) => {
    const tipo = req.body.tipo_examen;
    const id_examen = req.body.id_examen;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO detalle_examen(id_tipo_examen, id_examen) VALUES (?,?)', [tipo, id_examen], (err, examen) => {
            if (!(examen === undefined)) {
                conn.query('SELECT * FROM tipo_examen WHERE id_tipo_examen = ?;', tipo, (err, tipoExamen) => {
                    const precioExamen = tipoExamen[0].precio;
                    conn.query('SELECT * FROM examen WHERE id_examen = ?', id_examen, (err, examenC) => {
                        const precioActual = examenC[0].total;
                        console.log('***TOTAL ACTUAL: ' + precioActual);
                        conn.query('UPDATE examen SET total = ? WHERE id_examen = ?;', [precioActual + precioExamen, id_examen], (err, update) => {
                            conn.query('SELECT * FROM tipo_examen;', (err, tipos) => {
                                console.log('****PRECIO:' + precioExamen);
                                res.render('ingresarDetalleExamen', {
                                    tipoExamen: tipos,
                                    examen: id_examen
                                });
                            });
                        });
                    });
                });
            }
        });
    });
}

controlador.ingresarPago = (req, res) => {
    const idExamen = req.body.idExamen;
    const tipoPago = req.body.tipoPago;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM examen WHERE id_examen = ?', idExamen, (err, examen) => {
            if (!(examen[0] === undefined)) {
                const fecha = examen[0].fecha;
                const pagoActual = examen[0].total;
                var totalPago = pagoActual;
                if (!(examen[0].id_medico === 0)) {
                    totalPago = pagoActual - (pagoActual * 0.07);
                }
                conn.query('INSERT INTO pago(id_examen,tipo_pago,fecha,total) VALUES (?,?,?,?)', [idExamen, tipoPago, fecha, totalPago], (err, pago) => {
                    res.redirect('/moduloSecretaria');
                });
            } else {
                res.redirect('/formPago');
            }
        });
    });
}

controlador.consultarExamen = (req, res) => {
    const idExamen = req.body.idExamen;
    req.getConnection((err, conn) => {
        conn.query('SELECT examen.id_examen, paciente.cui, paciente.nombre, paciente.apellido FROM examen INNER JOIN paciente ON examen.paciente_cui = paciente.cui WHERE id_examen = ?;', idExamen, (err, consultaPaciente) => {
            if (!(consultaPaciente[0] === undefined)) {
                conn.query('SELECT tipo_examen.nombre as tipoExamen, tipo_examen.precio as precio FROM detalle_examen INNER JOIN tipo_examen ON detalle_examen.id_tipo_examen = tipo_examen.id_tipo_examen WHERE id_examen = ?;', idExamen, (err, detalles) => {
                    res.render('vistaDetalleExamen', {
                        datos: detalles,
                        datosPaciente: consultaPaciente[0]
                    });
                });
            } else {
                res.redirect('/formConsultaDetalleExamen');
            }

        });

    });
}

controlador.consultarPaciente = (req, res) => {
    const cui = req.body.cui;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM paciente WHERE cui = ?', cui, (err, datos) => {
            if (!(datos[0] === undefined)) {
                res.render('vistaConsultaPaciente', {
                    paciente: datos[0]
                });
            }else{
                res.redirect('/formConsultaPaciente');
            }
        });
    });
}

controlador.editarPaciente = (req,res)=>{
    const cui = req.body.cui;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const sexo = req.body.sexo;
    const fecha = req.body.fecha;

    req.getConnection((err,conn)=>{
        conn.query('UPDATE paciente SET cui = ?, nombre = ?, apellido =?, sexo=?, fecha_nacimiento=? WHERE cui = ?;',[cui,nombre,apellido,sexo,fecha,cui],(err,paciente)=>{
            if(!(paciente === undefined)){
                res.render('moduloSecretaria');
            }else{
                res.redirect('/formConsultaPaciente');
            }
        });
    });
}

controlador.accederModulo = (req, res) => {
    res.render('moduloSecretaria');
}

controlador.accesarPaciente = (req, res) => {
    res.render('ingresarPaciente');
}

controlador.accesarPacientes = (req, res) => {
    res.render('pacientes');
}

controlador.accesarExamen = (req, res) => {
    res.render('ingresarExamen');
}

controlador.accesarPago = (req, res) => {
    res.render('ingresarPago');
}

controlador.accesarConsultaDetalleExamen = (req, res) => {
    res.render('consultarDetalleExamen');
}

controlador.accesarConsultaPaciente = (req, res) => {
    res.render('ingresarFormConsultaPaciente');
}

controlador.accesarEditarPaciente = (req,res)=>{
    const cui = req.params.cui;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM paciente WHERE cui = ?', cui, (err, datos) => {
            if (!(datos[0] === undefined)) {
                res.render('editarPaciente', {
                    paciente: datos[0]
                });
            }else{
                res.redirect('/formConsultaPaciente');
            }
        });
    });
}
module.exports = controlador;