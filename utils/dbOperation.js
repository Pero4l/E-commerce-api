const fs = require("fs");

const filePath = './data.json'

function readDb(){
    try{
        if(!fs.existsSync(filePath)) return {products: [], orders: [], users: []}
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data)
    } catch (err){
        console.log("Error reading file:", err);
        return {products: [], orders: [], users: []};
        
    }
}


function writeDb(data){
    try{
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    } catch (err){
        console.error("Error writing file:", err)
    }
}



module.exports = {
    readDb,
    writeDb
}