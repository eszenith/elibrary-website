var jwt = require('jsonwebtoken');

function jwtAuthenticate (req,res,next) {
    const reqHeaders = req.headers['authorization'];
    const token = reqHeaders && reqHeaders.split(' ')[1];

    if(token === null) return res.sendStatus(401);

    jwt.verify(token,'secret', (err, data)=> {

        if(err) {
            //why do we need to return sendStatus 
            return res.sendStatus(403);
        }
        req.tokenData = data;
        next();
    })
}

module.exports = jwtAuthenticate;