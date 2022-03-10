var express = require('express');
/*const con = require('../dbfunctions');*/
var connection = require('../dbfunctions');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtAuthenticate = require('../jwtAuthenticate');
//const { json } = require('express');

function genAccessToken(data) {
    return jwt.sign(data, 'secret', {expiresIn : '2000s'});
}

var router = express.Router();

router.use(function(req,res,next) {
    console.log("request");
    next();
});

router.use(function(req,res,next) {
    console.log("in index router");
    next();
});

//this files contains all the route handlers on the website

router.get('/', function (req, res, next) {
    res.redirect("/index.html");
});


router.post('/signup', function (req, res, next) {
    var qry = `insert into users(uname,upass,uage,umail) values(?,?,?,?)`;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.upass, salt, function(err, hash) {
            connection.query(qry, [req.body.username, hash, req.body.uage, req.body.umail], function (err, result) {
                if (err) {
                    res.cookie('register', 'no');
                    res.redirect('/signup.html')
                }
                res.cookie('register', 'yes')
                res.redirect('/signup.html')
            });
        });
    });
});


router.post('/login', function (req, res, next) {
    //var qry = `select * from users where uname='${req.body.username}'`;
    var qry = `select * from users where uname=?`;
    var userObj;
    console.log(qry);
    console.log("request : ");
    console.log(req.body);
    console.log(req.headers);
    var sqlQry = connection.query(qry, [req.body.username], function (err, result) {
        if (err) throw err;
        console.log(result);
        userObj = result[0];
        console.log(sqlQry.sql);
        console.log(userObj);
        if (!userObj)
            res.redirect('/index.html');
        else{
            bcrypt.compare(req.body.userpass,userObj.upass, function(err, result) {
                if(result)
                {
                    //res.cookie("login", "yes")
                    //res.cookie("uno", `${userObj['uno']}`);
                    var tkn = genAccessToken({'uno' : userObj['uno']});
                    console.log(tkn);
                    res.json(tkn);
                }
                else
                {
                    res.redirect("/");
                }
            });
        }
    });
});

router.get("/logout", function (req, res, next) {
    //res.clearCookie("login");
    res.clearCookie('token');
    /*res.cookie("uno");*/
    res.redirect("/");
});

router.get('/getBooks', function (req, res, next) {
    var qry = `select bno,bname from books`;
    connection.query(qry, function (err, result) {
        var jsonBookData = JSON.stringify(result);
        res.json(jsonBookData);
    });
});
/*
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
});*/

//auth
router.get('/getUserData', jwtAuthenticate ,function (req, res, next) {
    console.log(req.tokenData.uno);
    var qry = `select * from users where uno=?`;
    connection.query(qry,[req.tokenData.uno], function (err, result) {
        res.json(JSON.stringify(result[0]));
    });
});



router.get("/getBookData/:bookid", function (req, res, next) {
    var qry = `select * from books where bno=?`;
    console.log("getting book , " + qry);
    connection.query(qry,[req.params.bookid], function (err, result) {
        console.log(result);
        res.json(JSON.stringify(result[0]));
    });
});
/*
router.get("/getBookStars/:bookid", function (req, res, next) {
    var qry = `select stars,noOfUser from books where bno=?`;
    console.log(qry);
    connection.query(qry,[req.params.bookid],  function (err, result) {
        res.json(JSON.stringify(result[0]));
    });
});*/


router.get("/getSearchData/:sQry", function (req, res, next) {
    var qry = `select bno,bname from books where bname like ?`;
    console.log(qry);
    connection.query(qry,['%'+req.params.sQry+'%'], function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.json(JSON.stringify(result));
    });
});

router.get("/ebookpage/:bookid", function (req, res, next) {
    res.clearCookie("bno");
    res.cookie("bno", req.params.bookid);
    res.redirect("/ebookpage.html");
});


router.get("/userbookpage/:bookid", function (req, res, next) {
    res.clearCookie("bno");
    res.cookie("bno", req.params.bookid);
    res.redirect("/userbookpage.html");
});

module.exports = router;