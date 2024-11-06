const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

// this is syntax to connect to database..his concept of promise soon to learn forthcoming lessons...

const initializeDatabase = async () => {

   await mongoose
   .connect(mongoUri)
   .then(() => {
        console.log("Connected to Database")
    })
    .catch((error) => console.log("Error connecting to Database", error))
    
}

module.exports = { initializeDatabase }
