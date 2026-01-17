/**
 * @file validationMiddleware.js
 * @description Middleware for validating incoming request bodies using express-validator.
 */

import { body, validationResult } from "express-validator";

/**
 * Middleware to check for validation errors after expressing validation rules.
 * If errors exist, it sends a 400 Bad Request response with the error details.
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg, // Return the first error message for simplicity
            errors: errors.array(),
        });
    }
    next();
};

/**
 * Validation rules for user registration.
 * Checks name, email (valid format), and password (length and complexity).
 */
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

/**
 * Validation rules for user login.
 * Ensures email and password are provided and email is in the correct format.
 */
export const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address"),
    body("password")
        .notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for updating a user profile.
 * Fields are optional but must meet length requirements if provided.
 */
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
