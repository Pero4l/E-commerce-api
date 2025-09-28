const express = require('express')
const router = express.Router()

const {addProduct} = require('../controllers/productController')
const {authMiddleware} = require('../middleware/authUserMiddleware')
const {isAdmin} = require('../middleware/authPost')


router.post('/add',authMiddleware, isAdmin, addProduct)


module.exports = router