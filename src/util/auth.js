//
//
//
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const CF = require('../config/default')


const passwordHash = async(rawPassword) => {
    let salt = await bcrypt.genSalt(CF.jwt.saltLength)
    return await bcrypt.hash(rawPassword, salt)
}

const comparePassword = async(password, hash) => {
    return await bcrypt.compare(password, hash)
}

const createToken = (obj) => {
    return jwt.sign(
        { data: obj },
        CF.jwt.secret_str,
        { expiresIn: CF.jwt.token_exp}
    )
}


module.exports = {
    passwordHash,
    comparePassword,
    createToken
}
