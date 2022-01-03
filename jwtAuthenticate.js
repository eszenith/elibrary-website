var jwt = require('jsonwebtoken');

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

module.exports = jwtAuthenticate;