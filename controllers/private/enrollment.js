import express from "express"
import enrollmentModel from "../../models/Enrollment.js"
import studentModel from "../../models/Student.js"
import courseModel from "../../models/Course.js"

const router = express.Router()

router.post("/enroll", async (req,res) =>{
    try {
        let details = req.body
        let studentExists = await studentModel.findOne({_id: req.user.id, status: "active"} )

        if(!studentExists){
            return res.status(404).json({
                "msg" : "student does not exist with this id"
            })
        }

        let courseExists = await courseModel.findOne({_id:details.course_id, isActive: true})
        if(!courseExists){
            return res.status(404).json({
                "msg" : "course not exists or is currently not active"
            })
        }

        let object = {
            student_id: req.user.id,
            ...details
        }

        let enrollment = await enrollmentModel.create(object)
        res.status(201).json({
            "msg" : ` enrolled for ${details.course_id} successfully`, enrollment
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})

router.patch("/update-enrollment/:id", async (req,res) =>{
    try {
        let status = req.body
        let enrollmentId = req.params.id
        
        let checkIfExists = await enrollmentModel.findById(enrollmentId)
        if(!checkIfExists){
            return res.status(404).json({
                "msg" : "enrollment not found"
            })
        }

        let updated = await enrollmentModel.findOneAndUpdate({_id: enrollmentId},
            {$set: status}, {new: true}
        )

        res.status(201).json({
            "msg" : "enrollment updated successfully", updated
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})

router.get("/get-all", async (req,res) =>{
    try {
        let studentId = req.user.id
        let studentExists = await studentModel.findOne({_id: req.user.id, status: "active"} )

        if(!studentExists){
            return res.status(404).json({
                "msg" : "student does not exist with this id"
            })
        }

        let enrolled = await enrollmentModel.find({student_id: studentId}).populate("student_id", "name email age gender -_id")
                                            .populate("course_id", "title code instructor fee -_id")
                                            .select("-_id student_id status enrolledAt")

        res.status(200).json({
            "msg" : "all courses info registed from this student", enrolled
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "msg" : "internal server error"
        })        
    }
})

export default router