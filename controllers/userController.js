const {readDb, writeDb} = require("../utils/dbOperation")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()


async function register(req, res){
     const {name, email, password} = req.body;

     let data = readDb()

     if (!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });

    } else if ( !/[A-Z]/.test(password) || !/[a-z]/.test(password)){
         return res.status(400).json({
            message: "Password must contain both uppercase and lowercase letters"
        });

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({message: "Invalid email format"});

    } else if (name.length < 3) {
        return res.status(400).json({message: "Name must be at least 3 characters"});
    }

    if(data['users'].find((u)=> u.email === email)){
         return res.status(400).json({
            "success": false,
            "message": "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 13)
    const id = data['users'].length + 1;
    const role = "user"
    const date = new Date().toLocaleDateString('en-CA');

    const newUser = {id, name, email, role, password: hashedPassword, date, notifications: []}

    const notification = "Account created successfully"
    newUser['notifications'].push(notification)

    data['users'].push(newUser)
    writeDb(data)

    res.status(201).json({ 
        "success" : true,
        "message": "User registered successfully",
        "data": newUser
    });

}


async function login(req, res) {

    const token = jwt.sign({userId: req.data.id}, process.env.JWT_SECRET, {expiresIn: '1h'})

    const userId = req.data.id
    
    if(req.user){
        return res.status(200).json({
        "success": true,
        "message": "Login Successfully",
        "token": token,
        "userId": userId
    })
    }
    
}



module.exports = {
    register,
    login
}