const express = require('express');
const app = express()
const PORT = 3000

const userAuth = require('./router/user.route')
const product = require('./router/product.route')

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        "message": "Wecome to my E-commerce API"
    })
})


app.use('/auth', userAuth)
app.use('/product', product)



app.listen(PORT, () =>{
    console.log(`Server Running on PORT:${PORT}`);
    
})
