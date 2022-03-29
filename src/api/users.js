//
//
const router = require('express').Router()
const { check, validationResult } = require('express-validator')


const register = async (req, res) => {
    await check('name', 'Name is required').notEmpty().run(req)
    await check('email', 'Please include a valid email').isEmail().run(req)
    await check('password', 'length 6 or more characters').isLength({ min: 6 }).run(req)

    let errors = validationResult(req)
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() })
    }
    return res.json(res.body)
}

module.exports = {
    register
}
