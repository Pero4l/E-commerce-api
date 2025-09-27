const express = require('express')
const router = express.Router()

const{register, login} = require('../controllers/userController')
const{loginMiddleware} = require('../middleware/loginMiddleware')


router.post('/register', register)
router.post('/login', loginMiddleware, login)


module.exports = router
