import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true
    },
    rollNumber: {
        type: Number,
        required: true,
        // trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        Lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxLength: 100
    },
    age: {
        type: Number,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive", "graduated"],
        default: "active"
    }
}, {timestamps: true}) 

const studentModel = mongoose.model("students", studentSchema)

export default studentModel

