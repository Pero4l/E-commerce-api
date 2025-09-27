const {readDb} = require('../utils/dbOperation')
const bcrypt = require('bcrypt')

async function loginMiddleware(req, res, next){
    const {email, password} = req.body

    const data = readDb()
    const existUser = data['users'].find((u) => u.email === email)

    if (!existUser) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const passMatch = await bcrypt.compare(password, existUser.password)
     if (!passMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    req.user = passMatch
    req.data = existUser
    next()
}


module.exports = {
    loginMiddleware
}