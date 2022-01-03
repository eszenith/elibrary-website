var express = require('express');
/*const con = require('../dbfunctions');*/
var connection = require('../dbfunctions');
var jwt = require('jsonwebtoken');
const jwtAuthenticate = require('../jwtAuthenticate');
//const { json } = require('express');


var router = express.Router();

router.use(function(req,res,next) {
    console.log("in book action router");
    next();
});

router.use(function(req,res,next) {
    console.log("in book action part ---2");
    next();
})

//auth
router.post("/issueBook/:bookid", jwtAuthenticate ,function (req, res, next) {
    //console.log("in issue books" + req.params.userid + " book id " + req.params.bookid);
    var qry = `INSERT INTO issue values(?,?)`;
    //console.log(qry);
    connection.query(qry,[req.tokenData.uno, req.params.bookid], function (err, result) {
        if (err) throw err;
        res.end();
    });
});

//auth
router.post("/returnBook/:bookid", jwtAuthenticate ,function (req, res, next) {
    //console.log("in return books");
    var qry = `delete from issue where uno=? and bno=?`;
    //console.log(qry);
    connection.query(qry,[req.tokenData.uno,req.params.bookid], function (err, result) {
        if (err) throw err;
        res.end();
    });
});

//auth
router.post("/checkIssue/:bookid",jwtAuthenticate , function (req, res, next) {
    var qry = `select * from issue where uno=? and bno=?`;
    //console.log(qry);
    connection.query(qry,[req.tokenData.uno ,req.params.bookid] ,function (err, result) {
        if (err) throw err;
        //console.log(result);
        //console.log(result.length);
        if (result.length !== 0) {
            //console.log("present");
            res.json(JSON.stringify({ 'check': 'yes' }));
        }
        else {
            res.json(JSON.stringify({ 'check': 'no' }));
        }
    });
})


module.exports = router;
