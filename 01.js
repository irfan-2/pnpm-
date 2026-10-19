import express, { application } from "express"
import dotenv from "dotenv"
dotenv.config()
import "./config/database.js"
import publicStudentRouter from "./controllers/public/student.js"
const app = express()
const port = process.env.PORT || 5000;
app.use(express.json())

app.get("/health", (req,res) =>{
    res.status(200).json({
        "msg" : "APIs are healthy"
    })
})

// app.post("")

app.use("/student", publicStudentRouter)

app.listen(port, ()=>{
    console.log("server is runnning");
    
})