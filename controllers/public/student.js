import express, { application } from "express"
import bcrypt from "bcrypt"
import studentModel from "../../models/Student.js"

const router = express.Router()

router.post("/register", async (req,res) =>{
    try {
        let {name, rollNumber, email, age, gender} = req.body
        let checkIfExists = await studentModel.findOne({ email: email})
        if(checkIfExists){
            return res.status(400).json({
                "msg" : "Student already exists"
            })
        }
        let newStudent = {
            name,
            rollNumber,
            email,
            age,
            gender
        }
        let response = await studentModel.create(newStudent)
        res.status(201).json({
            "msg" : "student created successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})

// router.post

export default router;
