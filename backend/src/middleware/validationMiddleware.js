import { body, validationResult } from "express-validator";

/* ======================
   Validation Result Handler
====================== */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg, // Return the first error message
            errors: errors.array(),
        });
    }
    next();
};

/* ======================
   Registration Validation
====================== */
export const registerValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[a-zA-Z]/).withMessage("Password must contain at least one letter"),
];

/* ======================
   Login Validation
====================== */
export const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address"),
    body("password")
        .notEmpty().withMessage("Password is required"),
];

/* ======================
   Profile Update Validation
====================== */
export const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
];
