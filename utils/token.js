import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

async function tokenize(payload){
    try {
        let token = await jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "7d"})
        return token
    } catch (error) {
        console.log(error.message);
        return error.message
    }
}

export default tokenize

