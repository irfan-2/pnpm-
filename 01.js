import express from "express"
import dotenv from "dotenv"
dotenv.config()
import "./config/database.js"
import publicStudentRouter from "./controllers/public/student.js"
import authMiddleware from "./middleware/auth.js"
import privateStudentRouter from "./controllers/private/student.js"


const app = express()
app.use(express.json())
const port = process.env.PORT || 5000;

app.get("/health", (req,res) =>{
    res.status(200).json({
        "msg" : "APIs are healthy"
    })
})

// app.post("")

app.use("/student", publicStudentRouter)
app.use(authMiddleware)
app.use("/private-student", privateStudentRouter)

app.listen(port, ()=>{
    console.log("server is runnning");
    
})