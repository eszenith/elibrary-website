var express = require('express');
var connection = require('../dbfunctions');
var jwt = require('jsonwebtoken');
const jwtAuthenticate = require('../jwtAuthenticate');


var router = express.Router();

//auth
router.get('/user/issued', jwtAuthenticate , function (req, res, next) {
    var qry = `select * from issue where uno = ?`;
    var qry2 = `select bno,bname from books where `;
    connection.query(qry, [req.tokenData.uno], function (err, result) {
        if (result.length !== 0) {
            let i = 0;
            for (i = 0; i < result.length - 1; i++) {
                qry2 += `bno = ${result[i]["bno"]} or `;

            }
            qry2 += `bno = ${result[i]["bno"]}`;
            //find the books user isssued
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

router.get("/search/:sQry", function (req, res, next) {
    var qry = `select bno,bname from books where bname like ?`;
    connection.query(qry,['%'+req.params.sQry+'%'], function (err, result) {
        if (err) throw err;
        res.json(JSON.stringify(result));
    });
});

router.get('/all', function (req, res, next) {
    var qry = `select bno,bname from books`;
    connection.query(qry, function (err, result) {
        var jsonBookData = JSON.stringify(result);
        res.json(jsonBookData);
    });
});



//auth
router.post("/issue/:bookid", jwtAuthenticate ,function (req, res, next) {

    var qry = `INSERT INTO issue values(?,?)`;
    connection.query(qry,[req.tokenData.uno, req.params.bookid], function (err, result) {
        if (err) throw err;
        res.end();
    });
});

//auth
router.post("/return/:bookid", jwtAuthenticate ,function (req, res, next) {
    var qry = `delete from issue where uno=? and bno=?`;
    connection.query(qry,[req.tokenData.uno,req.params.bookid], function (err, result) {
        if (err) throw err;
        res.end();
    });
});



//auth
router.post("/checkIssue/:bookid",jwtAuthenticate , function (req, res, next) {
    var qry = `select * from issue where uno=? and bno=?`;
    connection.query(qry,[req.tokenData.uno ,req.params.bookid] ,function (err, result) {
        if (err) throw err;
        if (result.length !== 0) {
            res.json(JSON.stringify({ 'check': 'yes' }));
        }
        else {
            res.json(JSON.stringify({ 'check': 'no' }));
        }
    });
})

router.get("/user/:bookid", function (req, res, next) {
    res.clearCookie("bno");
    res.cookie("bno", req.params.bookid);
    res.redirect("/userbookpage.html");
});

router.get("/:bookid", function (req, res, next) {
    var qry = `select * from books where bno=?`;
    connection.query(qry,[req.params.bookid], function (err, result) {
        res.json(JSON.stringify(result[0]));
    });
});



module.exports = router;
