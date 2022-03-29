//
//
const router = require('express').Router()


// -----------------------------------------------------------------------------
const users = require('./users')
router.post('/user', users.register)


// -----------------------------------------------------------------------------
module.exports = router
