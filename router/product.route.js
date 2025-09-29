const express = require('express')
const router = express.Router()

const {addProduct, editProduct, seeAllProducts, seeSingleProduct} = require('../controllers/productController')

const {authMiddleware} = require('../middleware/authUserMiddleware')
const {isAdmin} = require('../middleware/authPost')


router.post('/add',authMiddleware, isAdmin, addProduct)
router.patch('/edit', authMiddleware, isAdmin, editProduct)
router.get('/seeall', authMiddleware, seeAllProducts)
router.get('/:id', authMiddleware, seeSingleProduct)


module.exports = router