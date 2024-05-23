"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchAppointments = exports.validateCreateAppointment = exports.validateUpdateUserStatus = exports.validateSearchUsers = exports.validateList = exports.validateCreateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const response_1 = require("./response");
const validateCreateUser = (req, res) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        status: joi_1.default.string().valid("active", "inactive").required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        return (0, response_1.errorResponse)(res, 400, error.details[0].message, 400);
    }
    req.body = value;
};
exports.validateCreateUser = validateCreateUser;
const validateList = (req, res) => {
    const schema = joi_1.default.object({
        page: joi_1.default.string().pattern(/^\d+$/).default("1"),
        limit: joi_1.default.string().pattern(/^\d+$/).default("10"),
    });
    const { error, value } = schema.validate(req.query);
    if (error) {
        return (0, response_1.errorResponse)(res, 400, error.details[0].message, 400);
    }
    // Overwrite query with validated values
    req.query = value;
};
exports.validateList = validateList;
const validateSearchUsers = (req, res) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().optional(),
        email: joi_1.default.string().email().optional(),
        status: joi_1.default.string().valid("active", "inactive").optional(),
    });
    const { error, value } = schema.validate(req.query);
    if (error) {
        return (0, response_1.errorResponse)(res, 400, error.details[0].message, 400);
    }
    // Overwrite query with validated values
    req.query = value;
};
exports.validateSearchUsers = validateSearchUsers;
const validateUpdateUserStatus = (req, res) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().required(),
        status: joi_1.default.string().valid("active", "inactive").required(),
    });
    const { error, value } = schema.validate({ ...req.params, ...req.body });
    if (error) {
        return (0, response_1.errorResponse)(res, 400, error.details[0].message, 400);
    }
    // Overwrite params and body with validated values
    req.params = { id: value.id };
    req.body = { status: value.status };
};
exports.validateUpdateUserStatus = validateUpdateUserStatus;
// validators.ts
const validateCreateAppointment = (req, res) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().required(),
        date: joi_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
        startTime: joi_1.default.string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required(),
        endTime: joi_1.default.string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .custom((value, helpers) => {
            const startTime = new Date(`2022-01-01T${req.body.startTime}`);
            const endTime = new Date(`2022-01-01T${value}`);
            if (endTime <= startTime) {
                return helpers.error("any.invalid");
            }
            return value;
        })
            .required(),
    }).messages({
        "any.invalid": "End time must be greater than start time",
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        return (0, response_1.errorResponse)(res, 400, error.details[0].message, 400);
    }
    // Overwrite body with validated values
    req.body = value;
};
exports.validateCreateAppointment = validateCreateAppointment;
const validateSearchAppointments = (req, res) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().optional(),
        status: joi_1.default.string().valid("active", "inactive").optional(),
        date: joi_1.default.string()
            .regex(/^\d{4}-\d{2}-\d{2},\d{2}:\d{2}:\d{2}$/) // Validate the format 'YYYY-MM-DD,HH:MM:SS'
            .optional(),
    });
    const { error, value } = schema.validate(req.query);
    if (error) {
        return (0, response_1.errorResponse)(res, 400, error.details[0].message, 400);
    }
    // Overwrite query with validated values
    req.query = value;
};
exports.validateSearchAppointments = validateSearchAppointments;
