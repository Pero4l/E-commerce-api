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


    const notification = "Product added successfully"

    data['users'][0].notifications.push({notification})
     writeDb(data)


    
    
}


async function editProduct(req, res) {
    const{id, name, description, instock, price} = req.body

    const data = readDb()

    if(!id || !name.trim() || !description.trim() || !instock.trim() || !price.trim()){
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
    existProduct.name = name
    existProduct.description = description


    


    
}

module.exports = {addProduct}