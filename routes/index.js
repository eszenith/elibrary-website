var express = require('express');
/*const con = require('../dbfunctions');*/
var connection = require('../dbfunctions');
var jwt = require('jsonwebtoken');
//const { json } = require('express');

function genAccessToken(data) {
    return jwt.sign(data, 'secret', {expiresIn : '2000s'});
}

var router = express.Router();

//this files contains all the route handlers on the website

function jwtAuthenticate (req,res,next) {
    const reqHeaders = req.headers['authorization'];
    console.log(reqHeaders);
    const token = reqHeaders && reqHeaders.split(' ')[1];
    console.log("in authenticate middle ware")
    if(token === null) return res.sendStatus(401);

    jwt.verify(token,'secret', (err, data)=> {
        console.log(data);
        if(err) {
            console.log(err);
            console.log("sending status");
            //why do we need to return sendStatus 
            return res.sendStatus(403);
        }
        req.tokenData = data;
        console.log("ok");
        next();
    })
}

router.get('/', function (req, res, next) {
    res.redirect("/index.html");
});


router.get('/getBooks', function (req, res, next) {
    var qry = `select bno,bname from books`;

    connection.query(qry, function (err, result) {
        var jsonBookData = JSON.stringify(result);
        res.json(jsonBookData);
    });
});

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

router.post('/signup', function (req, res, next) {
    var qry = `insert into users(uname,upass,uage,umail) values(?,?,?,?)`;
    connection.query(qry, [req.body.username, req.body.upass, req.body.uage, req.body.umail], function (err, result) {
        if (err) {
            res.cookie('register', 'no');
            res.redirect('/signup.html')
        }
        //console.log('successfully registered');
        res.cookie('register', 'yes')
        res.redirect('/signup.html')
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
        if (userObj['upass'] === req.body.userpass) {
            res.cookie("login", "yes")
            //res.cookie("uno", `${userObj['uno']}`);
            var tkn = genAccessToken({'uno' : userObj['uno']});
            console.log(tkn);
            res.json(tkn);
            
        }
        else {
            res.redirect("/");
        }
        
    });
});

//auth
router.get('/getUserData', jwtAuthenticate ,function (req, res, next) {
    console.log(req.tokenData.uno);
    var qry = `select * from users where uno=?`;
    connection.query(qry,[req.tokenData.uno], function (err, result) {
        res.json(JSON.stringify(result[0]));
    });
});

router.get("/logout", function (req, res, next) {
    res.clearCookie("login");
    res.clearCookie('token');
    /*res.cookie("uno");*/
    res.redirect("/");
})

router.get("/getBookData/:bookid", function (req, res, next) {
    var qry = `select * from books where bno=?`;
    console.log("getting book , " + qry);
    connection.query(qry,[req.params.bookid], function (err, result) {
        console.log(result);
        res.json(JSON.stringify(result[0]));
    });
});

router.get("/getBookStars/:bookid", function (req, res, next) {
    var qry = `select stars,noOfUser from books where bno=?`;
    console.log(qry);
    connection.query(qry,[req.params.bookid],  function (err, result) {
        res.json(JSON.stringify(result[0]));
    });
});


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

//auth
router.get("/getUserStars/:bookid", jwtAuthenticate ,function (req, res, next) {
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
router.post("/setStars", jwtAuthenticate ,function (req, res, next) {
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