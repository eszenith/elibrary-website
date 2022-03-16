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
    var sqlQry = connection.query(qry, [req.body.username], function (err, result) {
        if (err) throw err;
        userObj = result[0];
        if (!userObj)
            res.redirect('/index.html');
        else{
            bcrypt.compare(req.body.userpass,userObj.upass, function(err, result) {
                if(result)
                {
                    //res.cookie("login", "yes")
                    //res.cookie("uno", `${userObj['uno']}`);
                    var tkn = genAccessToken({'uno' : userObj['uno']});
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



//auth
router.get('/userData', jwtAuthenticate ,function (req, res, next) {
    var qry = `select * from users where uno=?`;
    connection.query(qry,[req.tokenData.uno], function (err, result) {
        res.json(JSON.stringify(result[0]));
    });
});

router.get("/ebookpage/:bookid", function (req, res, next) {
    res.clearCookie("bno");
    res.cookie("bno", req.params.bookid);
    res.redirect("/ebookpage.html");
});


module.exports = router;