//
//
const router = require('express').Router()
const { authRequired } = require('../middleware/auth')


// -----------------------------------------------------------------------------
const users = require('./users')
router.post('/users', users.register)

// -----------------------------------------------------------------------------
const auth = require('./auth')
router.get('/auth', authRequired, auth.currentUser)
router.post('/auth', auth.login)


// -----------------------------------------------------------------------------
module.exports = router
