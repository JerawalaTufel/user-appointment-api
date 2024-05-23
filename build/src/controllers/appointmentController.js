"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointment = exports.searchAppointments = exports.listAppointments = void 0;
const models_1 = __importDefault(require("../models"));
const { Op } = require("sequelize");
const validation_1 = require("../services/validation");
const response_1 = require("../services/response");
const listAppointments = async (req, res) => {
    const validationResponse = (0, validation_1.validateList)(req, res);
    if (validationResponse) {
        return;
    }
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    try {
        const appointments = await models_1.default.Appointment.findAndCountAll({
            limit: Number(limit),
            offset,
        });
        (0, response_1.successResponse)(res, 200, "list of the appointments", 200, appointments);
        return;
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, error.message, 400);
        return;
    }
};
exports.listAppointments = listAppointments;
const searchAppointments = async (req, res) => {
    const validationResponse = (0, validation_1.validateSearchAppointments)(req, res);
    if (validationResponse) {
        return;
    }
    const { fullName, status, date } = req.query;
    try {
        let whereClause = {};
        let whereDate = {};
        if (fullName) {
            // Apply fullName condition to the User model's where clause
            whereClause = {
                ...whereClause,
                '$User.fullName$': {
                    [Op.like]: `%${fullName}%`, // Searching user by full name
                },
            };
        }
        if (status) {
            whereClause = {
                ...whereClause,
                '$User.status$': status, // Searching user by status
            };
        }
        if (date) {
            const dateString = date; // Assert type to string
            const [searchDate, searchTime] = dateString.split(",");
            console.log(searchDate, searchTime);
            // return;
            whereDate = {
                date: {
                    [Op.like]: `%${searchDate}%`,
                }, // Searching appointments by date
                endTime: {
                    [Op.lte]: searchTime, // Searching appointments ending before or at the specified time
                },
            };
        }
        const appointments = await models_1.default.Appointment.findAll({
            include: [
                {
                    model: models_1.default.User,
                    where: whereClause, // Apply the constructed whereClause to the User model
                },
            ],
            where: whereDate, // Apply the same whereClause for appointments
        });
        (0, response_1.successResponse)(res, 200, "list of the appointments", 200, appointments);
        return;
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, error.message, 400);
        return;
    }
};
exports.searchAppointments = searchAppointments;
const createAppointment = async (req, res) => {
    const validationResponse = (0, validation_1.validateCreateAppointment)(req, res);
    if (validationResponse) {
        return;
    }
    const { userId, date, startTime, endTime } = req.body;
    // Add validation logic here
    try {
        const user = await models_1.default.User.findByPk(userId);
        if (!user) {
            (0, response_1.errorResponse)(res, 400, "User is not exits", 400);
            return;
        }
        let dataValues = user.dataValues;
        if (!user || dataValues.status !== "active") {
            (0, response_1.errorResponse)(res, 400, "User is not Active", 400);
            return;
        }
        // Check for conflicting appointments
        const existingAppointments = await models_1.default.Appointment.findAll({
            where: { date, userId },
        });
        if (existingAppointments.length > 0) {
            (0, response_1.errorResponse)(res, 400, "User can book only 1 appointment per day", 400);
            return;
        }
        const appointment = await models_1.default.Appointment.create({
            userId,
            date,
            startTime,
            endTime,
        });
        (0, response_1.successResponse)(res, 201, "created appointment.", 200, appointment);
        return;
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, error.message, 400);
        return;
    }
};
exports.createAppointment = createAppointment;
