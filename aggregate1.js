import express from "express"
import studentModel from "./models/Student.js"
import courseModel from "./models/Course.js";
import enrollmentModel from "./models/Enrollment.js"

async function aggregratePractice(){
    try {
        let students = await studentModel.aggregate()
    } catch (error) {
        console.log(error.message);
        
    }
}
