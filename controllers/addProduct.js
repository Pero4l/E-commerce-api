const {readDb, writeDb} = require('../utils/dbOperation')

async function addProduct(req, res) {
    const{name, description, instock, price} = req.body

    const data = readDb()

    if(!name.trim() || !description.trim() || !instock.trim() || !price.trim()){
        return res.status(400).json({
            "success": false,
            "message": "All field are required"
        })
    }

    const existProduct = data['products'].find((p)=> p.name === name && p.description === description && p.price === price)

    if(existProduct){
        return res.status(401).json({
            "success": false,
            "message": "Product already exist"
        })
    }

    const id = data['products'].length + 1;
    const date = new Date().toLocaleDateString('en-CA');

    data['products'].push({id,name,description,instock,price,date})

    writeDb(data)

    res.status(201).json({
         "success": true,
         "message": "Product added successfully"
    })
    
    
}