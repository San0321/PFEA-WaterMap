var express = require('express');
var router = express.Router();
var Report = require("../models/report");



var data = [];
var waterdata;


/* GET home page. */
router.get('/', function(req, res, next) {
  waterdata = req.app.locals.waterdata;
  res.render('index', waterdata);

 //   console.error("in index");
 //   module.exports.myhandler = 
   // res.render('index', waterdata);

    /*
    exports.index = function(req, res, next){
      res.render('index', req.app.locals.waterdata);
    };
    */
    //var item = getData('1LB7X3KeRmaXgc5a3kYCUFpUb-cLK1Lt3AfrrGyecdY8');
    //myGrabEachSite(req, res);
    //grabEachSite(req,res, item);
    //res.render('index')
});

function sortByDate(){
   return function(a,b){
      var dateA = a.date.split('/');
      var dateB = b.date.split('/');
      if( dateA[2] > dateB[2]){
          return -1;
      }else if( dateA[2] <dateB[2]){
          return  1;
      }
      else{
          if( dateA[1] > dateB[1]){
          return -1;
          }else if( dateA[1] <dateB[1]){
              return  1;
          }
          else{
             if( dateA[0] > dateB[0]){
              return -1;
            }else if( dateA[0] <dateB[0]){
                  return  1;
              }
             else{
                return 0;
              }
          }
      }
   }
}

    
function grabEachSite(req,res){

    console.log("starting to grab each site");
    var firstQuery = new Promise((resolve, reject) => {
        Report.find({"sitio":'El Faro'}, function(err,logs) {
                if (!err) {
                resolve(logs);
                } else {
                 console.log(err);
                 console.log("Error has occured to achieve query");
                reject(err);
            }
     }).sort({date: -1});
    });

    var secondQuery = new Promise((resolve, reject) => {
        Report.find({"sitio":'Cañada Azteca'}, function(err,logs) {
                if (!err) {
                resolve(logs);
                } else {
                console.log(err);
                console.log("Error has occured to achieve query");
                reject(err);
            }
     }).sort({date: -1});
    });
    var thirdQuery = new Promise((resolve, reject) => {
        Report.find({"sitio":'San Antonio'}, function(err,logs) {
                if (!err) {
                resolve(logs);
                } else {
                console.log(err);
                reject(err);
            }
     }).sort({date: -1});
    });
    var fourthQuery = new Promise((resolve, reject) => {
        Report.find({"sitio":'El Vigia'}, function(err,logs) {
                if (!err) {
                resolve(logs);
                } else {
                console.log(err);
                reject(err);
            }
     }).sort({date: -1});
    });
    var fifthQuery = new Promise((resolve, reject) => {
        Report.find({"sitio":'Parque Mexico'}, function(err,logs) {
                if (!err) {
                resolve(logs);
                } else {
                console.log(err);
                reject(err);
            }
     }).sort({date: -1});
    });

    Promise.all([firstQuery, secondQuery,thirdQuery,fourthQuery,fifthQuery])
        .then((results) => {
            console.log("Sending to res");
            results[0].sort(sortByDate());
            results[1].sort(sortByDate());
            results[2].sort(sortByDate());
            results[3].sort(sortByDate());
            results[4].sort(sortByDate());
            console.log("Finish Sorting");
            console.log(results[0]);
            console.log(results[1]);
            console.log(results[2]);
            
            res.render('index', { "elfaro": results[0],
                                  "canada": results[1],
                                  "sanantonio": results[2],
                                  "elvigia": results[3],
                                  "parque": results[4],});
        })
        .catch((err) => {
            // Catch error
            console.log("Caugh error sending to RES");
            console.log(err);
            res.send({});
    });

}



module.exports = router;