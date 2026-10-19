import mongoose, { mongo } from "mongoose"
import dotenv from "dotenv"
async function connectDB() {
    try {
        const db_uri = process.env.MONGO_URI
        await mongoose.connect(db_uri)
        console.log("database connected successfully");
        
    } catch (error) {
        console.log(error.message);
        
    }
}

connectDB()