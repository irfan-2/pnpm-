import express from "express"
import studentModel from "../../models/Student.js"

const router = express.Router()

router.get("/profile", async (req,res) =>{
    try{
        let id = req.user.id 
        let student = await studentModel.findById(id, {
            _id: -1, name: 1, email: 1, rollNumber: 1, status: 1
        })
        if(!student){
            return res.status(404).json({
                "msg" : "Student not found, please register first!"
            })
        }
        res.status(200).json({
            "msg" : "student profile", student
        })
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({
            "msg" : "internal server error"
        })
        
    }
})

export default router 
