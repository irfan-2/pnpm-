import express from "express"
import studentModel from "../../models/Student.js"
import courseModel from "../../models/Course.js"
import enrollmentModel from "../../models/Enrollment.js"
import mongoose from "mongoose"

const router = express.Router()

// get all courses
router.get("/aggregate/courses", async (req,res) =>{
    try {
        let courses = await courseModel.aggregate(
            [{$match: {isActive: true},},
             {$project: {_id:0, title:1, code:1, fee:1, tags:1, duration:1}}
            ]
        )

        if(courses.length === 0){
            return res.status(200).json({
                "msg" : "there are no courses available at the moment"
            })
        }

        return res.status(200).json({
            "msg" : "these are all the courses available", courses
        })

    } catch (error) {
         console.log(error.message);
         res.status(500).json({
            "msg" : "internal server error"
         })
    }
})

// get course by code 

router.get("/aggregate/course/:code", async (req,res) =>{
    try {
        let courseCode = req.params.code
        let course = await courseModel.aggregate([
            {$match: {code: courseCode}, isActive: true},
            {$project:{_id:0, title:1, code:1, fee:1, tags:1, duration:1}}
        ])

        if(course.length === 0){
            return res.status(404).json({
                "msg" : "course with this code does not exist"
            })
        }

        res.status(200).json({
            "msg" : "the details of course are", course:course[0]
        })

    } catch (error) {
                 console.log(error.message);
         res.status(500).json({
            "msg" : "internal server error"
         })
    }
})

export default router