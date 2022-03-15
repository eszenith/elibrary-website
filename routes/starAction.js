var express = require('express');
/*const con = require('../dbfunctions');*/
var connection = require('../dbfunctions');
var jwt = require('jsonwebtoken');
const jwtAuthenticate = require('../jwtAuthenticate');
//const { json } = require('express');

var router = express.Router();



router.use(function(req,res,next) {
    console.log("in star action router");
    next();
});

router.get("/book/:bookid", function (req, res, next) {
    var qry = `select stars,noOfUser from books where bno=?`;
    console.log(qry);
    connection.query(qry,[req.params.bookid],  function (err, result) {
        res.json(JSON.stringify(result[0]));
    });
});

//auth
router.get("/user/:bookid", jwtAuthenticate ,function (req, res, next) {
    var qry = `select * from stars where uno = ? and bno = ?`;
    console.log(qry);
    connection.query(qry,[req.tokenData.uno,req.params.bookid] , function (err, result) {
        if (result.length !== 0) {
            res.json(JSON.stringify({ starsno: result[0].stars }));
        }
        else {
            res.json(JSON.stringify({ starsno: 0 }));
        }
    });
});

function updateBookStarAvg(bno, starsno) {
    var qry = `select stars, noOfUser from books where bno=?`;
    connection.query(qry,[bno], function (err, result) {
        if (err) throw err;
        console.log(result)
        var newRating = Math.ceil(((Number(result[0].stars) * Number(result[0].noOfUser)) + Number(starsno)) / (result[0].noOfUser + 1));

        console.log("*****the new rating is : " + newRating);
        var qry2 = `update books set stars = ${newRating}, noOfUser=${result[0].noOfUser + 1} where bno = ${bno}`;
        connection.query(qry2, function (err, result) {
            if (err) throw err;
        });
    });
}

//auth
router.post("/userRating", jwtAuthenticate ,function (req, res, next) {
    var qry = `select * from stars where uno = ? and bno = ?`;
    console.log(qry);
    connection.query(qry, [req.tokenData.uno , req.body.bno], function (err, result) {
        console.log(result);
        if (result.length !== 0) {
            var qry2 = `update stars set stars=? where uno = ? and bno = ?`;
            console.log(qry2);
            connection.query(qry2,[req.body.starsno,req.tokenData.uno,req.body.bno], function (err, result) {
                if (err) throw err;
            });
        }
        else {
            var qry2 = `insert into stars values(?, ?, ?)`;
            console.log(qry2);
            connection.query(qry2,[req.tokenData.uno,req.body.bno,req.body.starsno], function (err, result) {
                if (err) throw err;
                updateBookStarAvg(req.body.bno, req.body.starsno);
            });
        }
        res.end();
    });
});

module.exports = router;