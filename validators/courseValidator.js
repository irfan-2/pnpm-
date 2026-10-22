import {body, validationResult} from "express-validator"

let createCourseValidator = [
    body("title").trim()
    .isAlpha().withMessage("title Should be alphabets only")
    .notEmpty().withMessage("title is required")
    .isLength({min: 3, max: 50}).withMessage("title should be minimum 3 letters and maximum 50 letters"),

    body("code").trim()
    .notEmpty().withMessage("code is required")
    .isAlpha().withMessage("code Should be alphabets only"),

    body("instructor").trim()
    .notEmpty().withMessage("instructor is required")
    .isAlpha().withMessage("instructor name Should be alphabets only")
    .isLength({min: 6, max: 25}).withMessage("instructor name should be minimum 3 letters and maximum 25 letters"),

    body("fee").trim()
    .isNumeric().withMessage("Fee must be in number")
    .notEmpty().withMessage("fee is required"),

    body("duration").trim()
    .isAlpha().withMessage("duration Should be alphabets only")
    .notEmpty().withMessage("duration is required"),

]

let updateCouseValidator = [
    body("instructor").trim()
    .notEmpty().withMessage("instructor is required")
    .isAlpha().withMessage("instructor name Should be alphabets only")
    .isLength({min: 6, max: 25}).withMessage("instructor name should be minimum 3 letters and maximum 25 letters"),

    body("fee").trim()
    .isNumeric().withMessage("Fee must be in number")
    .notEmpty().withMessage("fee is required"),

    body("duration").trim()
    .isAlpha().withMessage("duration Should be alphabets only")
    .notEmpty().withMessage("duration is required"),
]

async function validation(req,res,next){
    try {
        let errors = await validationResult(req)
        if(!error.isEmpty()){
            res.status(400).json(errors)
        }
        next()
    } catch (error) {
        console.log(error.message);
        
    }
}

export {createCourseValidator, updateCouseValidator, validation} 