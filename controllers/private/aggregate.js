import express from "express"
import studentModel from "../../models/Student.js"
import courseModel from "../../models/Course.js"
import enrollmentModel from "../../models/Enrollment.js"
import mongoose from "mongoose"

const router = express.Router()

router.get("/profile", async (req, res) => {
    try {
        let studentId = req.user.id;

        let student = await studentModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(studentId),
                    status: "active"
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    rollNumber: 1,
                    email: 1,
                    age: 1,
                    gender: 1,
                    status: 1
                }
            }
        ]);

        if (student.length === 0) {
            return res.status(404).json({
                msg: "Student not found or inactive"
            });
        }

        return res.status(200).json({
            msg: "Student profile fetched successfully",
            student: student[0]
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});

// get logged in student courses

router.get("/aggregate/my-courses", async (req, res) => {
    try {
        let studentId = req.user.id;

        let courses = await enrollmentModel.aggregate([
            {
                $match: {
                    student_id: new mongoose.Types.ObjectId(studentId)
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            {
                $unwind: "$courseDetails"
            },
            {
                $project: {
                    _id: 0,
                    status: 1,
                    enrolledAt: 1,
                    "courseDetails.title": 1,
                    "courseDetails.code": 1,
                    "courseDetails.fee": 1,
                    "courseDetails.duration": 1
                }
            }
        ]);

        if (courses.length === 0) {
            return res.status(200).json({
                msg: "No enrolled courses found",
                courses: []
            });
        }

        return res.status(200).json({
            msg: "Enrolled courses fetched successfully",
            courses
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});

export default router 
