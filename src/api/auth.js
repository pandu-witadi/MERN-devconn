//
//
const { check, validationResult } = require('express-validator')
const CF = require('../config/default')
const User = require('../models/User')
const {
    passwordHash,
    comparePassword,
    createToken
} = require('../util/auth')


const currentUser = async (req, res) => {
    try {
        let user = await User.findById(req.userId).select('-password')
        let { hashPassword, __v, ...others } = user._doc
        return res.status(200).json({ ...others })
    } catch(err) {
        return res.status(500).json({ errors:  [{ msg: 'accessToken error' }] })
    }
}

const login = async (req, res) => {
    // input checking
    await check('email', 'Please include a valid email').isEmail().run(req)
    await check('password', 'Password is required').exists().run(req)

    const errors = validationResult(req)
    if ( !errors.isEmpty() )
        return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email: email })
        if (!user)
            return res.json({ errors: [{ msg: 'invalid credentials' }] })

        let chkPassword = await comparePassword(password, user.hashPassword)
        if (!chkPassword)
            return res.json({ errors: [{ msg: 'invalid credentials' }] })

        let accessToken = createToken({ userId: user._id })
        let { hashPassword, __v, ...others } = user._doc
        return res.status(200).json({
            accessToken: accessToken
        })
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: 'login error' }] })
    }
}

module.exports = {
    currentUser,
    login
}
