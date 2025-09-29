const express = require('express')
const router = express.Router()

const {addProduct, editProduct, seeAllProducts} = require('../controllers/productController')

const {authMiddleware} = require('../middleware/authUserMiddleware')
const {isAdmin} = require('../middleware/authPost')


router.post('/add',authMiddleware, isAdmin, addProduct)
router.patch('/edit', authMiddleware, isAdmin, editProduct)
router.get('/products', authMiddleware, seeAllProducts)


module.exports = router