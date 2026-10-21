import {body, validationResult} from "express-validator"

let registerValidator = [
    body("name").trim()
        .isAlpha().withMessage("Name Should be alphabets only")
        .notEmpty().withMessage("name is requires")
        .isLength({min: 3, max: 25}).withMessage("Name should be minimum 3 letters and maximum 25 letters"),

    body("email").trim()
        .isEmail().withMessage("Enter a valid email")
        .notEmpty().withMessage("Email ID is required"),

    body("password").trim()
        .notEmpty().withMessage("age is required")
        .isNumeric().withMessage("Age must be a number"),

    body("rollNumber").trim()
        .notEmpty().withMessage("Rollnumber is required")
        .isNumeric().withMessage("rollNumber must be a number"),
    
    
]

async function validation(req,res,next){
    try {
        let errors = await validationResult(req)
        if(!error.isEmail()){
            res.status(400).json(errors)
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

export {registerValidator, validation}