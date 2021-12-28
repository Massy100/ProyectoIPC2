const req = require("express/lib/request");
const res = require("express/lib/response");

const controlador = {};

controlador.ingresarResultado = (req, res) => {
    const id = req.body.id;
    const id_examen = req.body.id_examen;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM examen WHERE id_examen = ?', id_examen, (err, examenes) => {
            if (!(examenes[0] === undefined)) {
                conn.query('INSERT INTO resultado(id_resultado, id_examen) VALUES (?,?)', [id, id_examen], (err, resultado) => {
                    conn.query("SELECT campo.id_campo, campo.nombre as nombreCampo, tipo_examen.nombre as nombreTipoExamen FROM detalle_examen INNER JOIN tipo_examen on detalle_examen.id_tipo_examen = tipo_examen.id_tipo_examen INNER JOIN campo on campo.id_tipo_examen = tipo_examen.id_tipo_examen WHERE id_examen = ? ;", id_examen, (err, datos) => {
                        res.render('ingresarDetalleResultado', {
                            resultado: id,
                            examen: id_examen,
                            data: datos
                        });
                    });
                });
            } else {
                res.redirect('/formResultado');
            }
        });

    });
}

controlador.ingresarDetalleResultado = (req, res) => {
    const descripcion = req.body.descripcion;
    const idCampo = req.body.campo;
    const idResultado = req.body.resultado;
    const idExamen = req.body.idExamen;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO detalle_resultado(descripcion,id_resultado,id_campo) VALUES (?,?,?);', [descripcion, idResultado, idCampo], (err, detalle) => {
            conn.query('INSERT INTO resultado(id_resultado, id_examen) VALUES (?,?)', [idResultado, idExamen], (err, resultado) => {
                conn.query("SELECT campo.id_campo, campo.nombre as nombreCampo, tipo_examen.nombre as nombreTipoExamen FROM detalle_examen INNER JOIN tipo_examen on detalle_examen.id_tipo_examen = tipo_examen.id_tipo_examen INNER JOIN campo on campo.id_tipo_examen = tipo_examen.id_tipo_examen WHERE id_examen = ?;", idExamen, (err, datos) => {
                    res.render('ingresarDetalleResultado', {
                        resultado: idResultado,
                        examen: idExamen,
                        data: datos
                    });
                });
            });
        });
    });
}

controlador.login = (req, res) => {
    res.render('moduloLaboratorista');
}

controlador.accesarResultado = (req, res) => {
    res.render('ingresarResultado');
}

module.exports = controlador;