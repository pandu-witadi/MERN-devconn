//
//
//
const jwt = require('jsonwebtoken');
const CF = require('../config/default')


const authRequired = (req, res, next) => {
    let accessToken = null

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        accessToken = req.headers.authorization.split(' ')[1]
    else
        accessToken = req.query.accessToken || req.headers['x-access-token']

    if(!accessToken)
        return res.status(401).json({ errors: [{ msg: "No authentication token, access denied" }] })

    try {
        var decoded = jwt.verify(accessToken, CF.jwt.secret_str)
        req.userId = decoded.data.userId
        next()
    } catch (err) {
        return res.status(401).json({ errors:  [{ msg: 'Token verification failed, authorization denied'  }] })
    }
}


module.exports = {
    authRequired
}
