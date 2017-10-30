var express     = require('express'),
    multer      = require('multer'),
    xlsxtojson  = require('xlsx-to-json-lc'),
    fs          = require('fs')
    Report      = require('../models/report');

var router = express.Router();

var setDateTime = "";

// returns todays date
// format: year_month_date-hour(24 hrs)_minute_second
function getTodaysDateTime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    return date + '_' + time;
}

// returns array of filenames exactly as they appear in uploads dir
function getUploadedFiles() {
    var filenames = [];
    fs.readdirSync('./uploads/').forEach(file => {
        filenames.push(file);
    });
    return filenames;
}

function formatFilename( filename){
     var namesplit = filename.originalname.split('.');
     var newString = filename.originalname.replace(/\.[^/.]+$/, "") + '_'
            + setDateTime + '.' + namesplit[namesplit.length-1];
     return newString;
}


function isAdmin(req, res, next) {
    if (req.session.username) {
        return next();
    }
    res.redirect('/users');
}

var storage = multer.diskStorage({
    // set destination location
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    // specify file name to use when saving to disk
    // format: [original file name][date+time uploaded].[file extension(should always be xlsx)]
    filename: function (req, file, cb) {
        var namesplit = file.originalname.split('.');
        setDateTime = getTodaysDateTime();
        //add timestamp to prevent overwriting when uploading files with duplicate names
        cb(null, file.originalname.replace(/\.[^/.]+$/, "") + '_' + setDateTime + '.' + namesplit[namesplit.length-1])
    }
});


var upload = multer({
    storage: storage,
    fileFilter : function(req, file, cb) {
        // check for proper file extension
        if (['xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return cb(new Error('Wrong extension type'));
        }
        cb(null, true);
    }
}).single('file');




router.get('/', function(req, res) {
    var loggedIn = false;
    var username = "";
    if (req.session.username) {
        loggedIn = true;
        username = req.session.username;
    }
    res.render('upload',
    {
        title: 'upload files',
        pastData: getUploadedFiles(),
        loggedIn: loggedIn,
        username: username
    });
});

router.get('/download', function(req, res) {
    var file = './uploads/' + req.query.fname;
    res.download(file);
});

router.get('/delete', isAdmin, function(req, res) {
    var justfile = req.query.fname;
    var file = './uploads/' + req.query.fname;
    fs.stat(file, function(err, stats) {
        if (err) {
            console.log("Error deleting report: " + err);
            res.send("An error occurred: " + err);
            return;
        }
        fs.unlink(file, function(err) {
            if (err) {
                return res.render('upload', { err: true, msg: err });
            }
        });
    });

    Report.remove({"file": justfile} , function(err,logs) {
        if (err) {
            return res.render('upload', { err: true, msg: err });
        }
     });
    res.redirect('/upload');
})

/**
 * @api {post} /upload Save xlsx file to database
 * @apiName Upload XLSX
 *
 * @apiParam {file} file to be uploaded
 *
 * @apiSuccess {Boolean} err error if occured
 * @apiSuccess {String} msg error message
 */
 router.post('/', isAdmin, function(req, res) {
    upload(req, res, function(err) {


        if (err) {
            res.render('upload',
                {
                    err: true,
                    msg: err
                });
            return;
        }

        if (!req.file) {
            res.render('upload',
                    {
                        err: true,
                        msg: "No file passed"
                    });
            return;
        }

        try {
            xlsxtojson({
                input: req.file.path,
                output: null,
                lowerCaseHeaders: true
            }, function(err, result) {
               // console.log("Result: %j \n", result);
                if (err) {
                    res.render('upload',
                        {
                            err: true,
                            msg: err
                        });
                    return;
                }
                // result holds the json parsed from file
                var formatname = formatFilename(req.file);
                for (var i = 0; i < result.length; i++) {
                    var report = result[i];
                    var newReport = new Report({
                        date: report["fecha (dd/mm/aaaa)"],
                        sitio: report["sitio"],
                        recoleccion: report["hora de recolección (hh:mm)"],
                        bacteriologico: report["enterococos (nmp/100ml)"],
                        temperatura: report["temperatura (°c)"],
                        potencial: report["potencial (ph)"],
                        conductividad: report["conductividad (µs/cm)"],
                        oxigeno_disuelto: report[/oxigeno.*/],
                        tds: report["tds (mg/l)"],
                        salinidad: report["salinidad  (psu)"],
                        presion: report["presion (psi)"],
                        densidad: report["densidad (σt)"],
                        file: formatname
                    });

                    newReport.save(function(err) {
                        if (err) {
                            return res.render('upload', { err: true, msg: err });
                        }
                    });
                }
                return res.render('upload',
                    {
                        title: 'upload files',
                        pastData: getUploadedFiles(),
                        err: false,
                        msg: 'File Successfully Updated'
                    });
            });
        } catch (e) {
            return res.render('upload',
                {
                    err: true,
                    msg: "Corrupted excel file"
                });
        }
    });
});

module.exports = router;
