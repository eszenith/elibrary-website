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
router.get('/getUserBooks/', jwtAuthenticate , function (req, res, next) {
    var qry = `select * from issue where uno = ?`;
    //console.log("in user books" + qry);
    var qry2 = `select bno,bname from books where `;
    connection.query(qry, [req.tokenData.uno], function (err, result) {
        if (result.length !== 0) {
            let i = 0;
            for (i = 0; i < result.length - 1; i++) {
                qry2 += `bno = ${result[i]["bno"]} or `;

            }
            qry2 += `bno = ${result[i]["bno"]}`;
            //find the books user isssued
            //console.log(qry2);
            connection.query(qry2, function (err2, result2) {
                if (err2) throw err2;
                var jsonBookData = JSON.stringify(result2);
                res.json(jsonBookData);
            });
        }
        else {
            //when no issued book send empty array
            var jsonBookData = JSON.stringify(result);
            res.json(jsonBookData);
        }
    });
});

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
