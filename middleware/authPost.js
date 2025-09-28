async function isAdmin(req, res, next) {
    const user = req.user
    
    if(user.role === "admin"){
        next()
    } else{
         return res.status(403).json({
            "success": false,
            "message": "Can't make a post"
        })
    }
}

module.exports = {isAdmin}