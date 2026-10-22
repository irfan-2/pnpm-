import express from "express"
import studentModel from "../../models/Student.js"
import bcrypt from "bcrypt"
import enrollmentModel from "../../models/Enrollment.js"

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

router.patch("/update", async (req,res) =>{
    try {
        let id = req.user.id
        let student = await studentModel.findById(id)
        
        if(!student){
            return res.status(400).json({
                "msg" : "student not found. please register first"
            })
        }

        if(student.status != "active"){
           return res.status(400).json({
                "msg" : `Student with id ${id} is currently inactive or graduated`
            })
        }

        let changes = req.body
        if( Object.keys(changes).includes("name") ||
            Object.keys(changes).includes("rollNumber") ||
            Object.keys(changes).includes("gender") ||
            Object.keys(changes).includes("password") ){
                return res.status(400).json({
                 msg: "You cannot update these fields"
               })
        }
        
        let operation = await studentModel.findOneAndUpdate({_id: id},
            { $set: changes}, {new : true}
        ).select("name rollNumber email age gender -_id")

        res.status(200).json({
            "msg" : "Student profile updated successfully", operation
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})

router.patch("/change-password", async (req,res) =>{
    try {
        let id = req.user.id
        let {oldPassword, newPassword} = req.body

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                "msg" : "please provide old and new  passowrd"
            })
        }

        let student = await studentModel.findById(id).select("+password")

        if(!student){
            return res.status(404).json({
                "msg" : "Student not found"
            }) 
        }

        if (student.status !== "active") {
            return res.status(403).json({
                msg: "Student account is inactive or graduated"
            });
        }

        let passwordMatch = await bcrypt.compare(
            oldPassword, student.password
        )

        if (!passwordMatch) {
            return res.status(400).json({
                msg: "Old password is incorrect"
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                msg: "New password must be different from old password"
            });
        }

        let hashedPassword = await bcrypt.hash(newPassword, 10)

        await studentModel.findByIdAndUpdate(id, {$set: {password:  hashedPassword}})

        res.status(200).json({
            "msg" : "Password changed successfully"
        })

    } catch (error) {
         console.log(error);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})

router.patch("/deactivate-student", async (req,res) =>{
    try {
        const id = req.user.id
        const student = await studentModel.findById(id)

        if(!student){
            return res.status(404).json({
                "msg" : "student not found"
            })
        }

        if(student.status === "inactive"){
            return res.status(404).json({
                "msg" : "student is already inactive"
            })
        }

        student.status= "inactive"
        await student.save()
        return res.status(200).json({
            "msg" : "student deactivaed successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})

router.get("/my-courses", async(req,res) =>{
    try {
       let id = req.user.id;

        const enrollments = await enrollmentModel
            .find({ student_id: id })
            .populate("course_id", "title code instructor fee duration tags -_id");

        const courses = enrollments
            .map(enrollment => enrollment.course_id)
            .filter(course => course !== null);

        return res.status(200).json({
            msg: "Courses fetched successfully",
            count: courses.length,
            courses
        });


    } catch (error) {
         console.log(error);
        res.status(500).json({
            "msg" : "internal server error"
        })
    }
})



export default router 
