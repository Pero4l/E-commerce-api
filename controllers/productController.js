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

    const product = data['products'].find((p)=> p.id === id)

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

module.exports = {addProduct, editProduct, seeAllProducts, seeSingleProduct}