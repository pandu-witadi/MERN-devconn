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
const profile = require('./profile')
router.get('/profile/me', authRequired, profile.currentProfile)
router.post('/profile', authRequired, profile.createOrUpdate)


// -----------------------------------------------------------------------------
module.exports = router
