var mongoose    = require('mongoose');

var water_model = mongoose.Schema({
    date: String,
    sitio: String,
    recoleccion: String,
    bacteriologico: String,
    temperatura: String,
    potencial: String,
    conductividad: String,
    oxigeno_disuelto: String,
    saturacion_oxigeno: String,
    tds: String,
    salinidad: String,
    presion : String,
    densidad: String,
    file: String
});

var Report = mongoose.model('Report', water_model);

module.exports = Report;



// sample Report creation/saving to db
// var new_report = new Report({
//     date: new Date(),
//     sitio: "SD",
//     recoleccion: "",
//     bacteriologico: 9000,
//     temperatura: 95,
//     potencial: 0,
//     conductividad: 0,
//     oxigeno_disuelto: 0,
//     saturacion_oxigeno: 0,
//     tds: 0,
//     salinidad: 0,
//     presion : 0,
//     densidad: 0
// });
// new_report.save(function(err) {
//     if (err) throw err;
//     console.log('User saved successfully');
// });
