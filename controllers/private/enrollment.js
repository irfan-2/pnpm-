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

router.patch("/cancel/:id", async (req, res) => {
    try {
        let studentId = req.user.id;
        let enrollmentId = req.params.id;

        let enrollment = await enrollmentModel.findOne({
            _id: enrollmentId,
            student_id: studentId
        });

        if (!enrollment) {
            return res.status(404).json({
                msg: "Enrollment not found"
            });
        }

        if (enrollment.status === "withdrawn") {
            return res.status(400).json({
                msg: "Enrollment is already withdrawn"
            });
        }

        let operation = await enrollmentModel.findOneAndUpdate(
            {
                _id: enrollmentId,
                student_id: studentId
            },
            { $set: { status: "withdrawn" } },
            { new : true }
        ).select("student_id course_id status enrolledAt -_id");

        res.status(200).json({
            msg: "Enrollment withdrawn successfully",
            operation
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal server error"
        });
    }
});

router.patch("/restore/:id", async (req, res) => {
    try {
        let studentId = req.user.id;
        let enrollmentId = req.params.id;

        let enrollment = await enrollmentModel.findOne({
            _id: enrollmentId,
            student_id: studentId
        });

        if (!enrollment) {
            return res.status(404).json({
                msg: "Enrollment not found"
            });
        }

        if (enrollment.status !== "cancelled") {
            return res.status(400).json({
                msg: "Only cancelled enrollments can be restored"
            });
        }

        let operation = await enrollmentModel.findOneAndUpdate(
            {
                _id: enrollmentId,
                student_id: studentId,
                status: "cancelled"
            },
            {
                $set: { status: "enrolled" }
            },
            {
                new : true
            }
        ).select("student_id course_id status enrolledAt -_id");

        res.status(200).json({
            msg: "Enrollment restored successfully",
            operation
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal server error"
        });
    }
});

router.get("/withdrawn-enrollments", async (req, res) => {
    try {
        let studentId = req.user.id;

        let withdrawn = await enrollmentModel
            .find({
                student_id: studentId,
                status: "withdrawn"
            })
            .populate("course_id", "title code instructor fee -_id")
            .select("course_id status enrolledAt -_id");

        if (withdrawn.length === 0) {
            return res.status(200).json({
                msg: "No withdrawn enrollments found",
                count: 0,
                withdrawn: []
            });
        }

        res.status(200).json({
            msg: "withdrawn enrollments fetched successfully",
            count: withdrawn.length,
            withdrawn
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal server error"
        });
    }
});

export default router