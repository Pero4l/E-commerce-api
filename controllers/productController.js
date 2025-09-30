const {readDb, writeDb} = require('../utils/dbOperation')

async function addProduct(req, res) {
    const{name, description, instock, price} = req.body

    const data = readDb()

    if(!name.trim() || !description.trim() || !instock || !price.trim()){
        return res.status(400).json({
            "success": false,
            "message": "All field are required"
        })
    }

    const existProduct = data['products'].find((p)=> p.name === name && p.description === description && p.price === price)

    if(existProduct){
        return res.status(400).json({
            "success": false,
            "message": "Product already exist"
        })
    }

    const id = data['products'].length + 1;
    const date = new Date().toLocaleDateString('en-CA');

    const newProduct = {id,name,description,instock,price,date}

    data['products'].push(newProduct)

    writeDb(data)

    res.status(201).json({
         "success": true,
         "message": "Product added successfully",
         "data": newProduct
    })


    const notification = `Product added successfully at ${date}`

    data['users'][0].notifications.push({notification})
     writeDb(data)



    
    
}


async function editProduct(req, res) {
    const{id, name, description, instock, price} = req.body

    const data = readDb()

    if(!id || !name.trim() || !description.trim() || !instock || !price.trim()){
        return res.status(400).json({
            "success": false,
            "message": "All field are required"
        })
    }

    const existProduct = data['products'].find((p)=> p.id === id)

    if(!existProduct){
        return res.status(400).json({
            "success": false,
            "message": "Product does not exist"
        })
    }

    const date = new Date().toLocaleDateString('en-CA');
    existProduct.name = name || existProduct.name
    existProduct.description = description || existProduct.description
    existProduct.instock = instock || existProduct.instock
    existProduct.price = price || existProduct.price

    res.status(200).json({
         "success": true,
         "message": "Product edited successfully"
    })


    const notification = `Product edited successfully at ${date}`

    data['users'][0].notifications.push({notification})
     writeDb(data)

    


    
}


async function seeAllProducts(req, res) {
    const data = readDb()

    const allProducts = data['products']

    res.status(200).json({
        "success": true,
        "message": "Gotten all products successfully",
        "data": allProducts
    })
}


async function seeSingleProduct(req, res) {
    const {id} = req.params

    const data = readDb()

    const product = data['products'].find((p)=> p.id === Number(id))

    if(!product){
        return res.status(404).json({
            "success": false,
            "message": "Product not found"
        })

    }else{
        res.status(200).json({
            "success": true,
            "message": "Product found",
            "data": product
        })
    }
}


async function buyProduct(req, res) {
    const {id, quantity} = req.body
    const data = readDb()

    if(quantity === 0){
        return res.status(404).json({
            "success": false,
            "message": "Quantity can't be 0"
        })
    }

    const product = data['products'].find((p) => p.id === id)

    if(!product){
        return res.status(404).json({
            "success": false,
            "message": "Product not found"
        })
    }

    if(quantity > product.instock){
        return res.status(400).json({
            "success": false,
            "message": "Quantity can't be greater than available product"
        })
    }

    const user = req.user

    product.instock -= quantity
    const productName = product.name
    const productPrice = product.price
    const numericPrice = Number(productPrice.replace(/[^0-9.-]+/g,""))
    const totalPrice = numericPrice * quantity
    const productId = product.id
    const orderId = data['orders'].length + 1
    const status = "Pending"
    const buyerId = user.userId
    const buyer = user.currentUser
    const date = new Date().toLocaleDateString('en-CA');

    const order = {
        orderId,
        productId,
        productName,
        quantity,
        productPrice,
        totalPrice,
        status,
        buyerId,
        buyer,
        date
    }

    const cart = {
        productName,
        quantity,
        totalPrice,
        status,
        date
    }


    data['orders'].push(order)

    try{
        writeDb(data)
    } catch (err){
        console.log("Error buying product");
        
    }

    res.status(201).json({
        "success": true,
        "message": "Product bought successfully",
        "data": order
    })

    const orderNotification = `An order with id:${orderId} have been placed by ${buyer} with user id:${buyerId}, bought ${quantity} of ${productName} on the ${date}`
    const purchaseNotification = `You purchased ${quantity} ${productName}(s) on ${date}, your order is being processed`

    data['users'][0].notifications.push({orderNotification})

     const theUser = data['users'].find((u)=> u.id === buyerId)
      theUser.notifications.push({purchaseNotification})
      theUser.cart.push(cart)

     writeDb(data)

}


async function seeAllOrders(req, res) {
    const data = readDb()
    const allOrders = data['orders']

    res.status(200).json({
        "success": true,
        "message": "Gotten all orders successfully",
        "data": allOrders
    })
    
}


async function cart(req, res) {
    const data = readDb()
    const user = req.user
    const theUser = data['users'].find((u)=> u.id === user.userId)
    const cart = theUser.cart

    res.status(200).json({
        "success": true,
        "message": "Gotten all orders successfully",
        "data": cart
    })
    
}




module.exports = {addProduct, editProduct, seeAllProducts, seeSingleProduct, buyProduct, seeAllOrders, cart}