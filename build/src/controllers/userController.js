"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.createUser = exports.searchUsers = exports.listUsers = void 0;
const models_1 = __importDefault(require("../models"));
const validation_1 = require("../services/validation");
const response_1 = require("../services/response");
const listUsers = async (req, res) => {
    const validationResponse = (0, validation_1.validateList)(req, res);
    if (validationResponse) {
        return;
    }
    const { page = "1", limit = "10" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    try {
        const users = await models_1.default.User.findAndCountAll({
            limit: Number(limit),
            offset,
        });
        (0, response_1.successResponse)(res, 200, "list of the users", 200, users);
        return;
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, error.message, 400);
        return;
    }
};
exports.listUsers = listUsers;
const searchUsers = async (req, res) => {
    const validationResponse = (0, validation_1.validateSearchUsers)(req, res);
    if (validationResponse) {
        return;
    }
    const { fullName, email, status } = req.query;
    try {
        let whereClause = {};
        if (fullName)
            whereClause.fullName = fullName;
        if (email)
            whereClause.email = email;
        if (status)
            whereClause.status = status;
        let users;
        // If all values are undefined, find all users
        if (!fullName && !email && !status) {
            users = await models_1.default.User.findAll();
        }
        else {
            users = await models_1.default.User.findAll({ where: whereClause });
        }
        (0, response_1.successResponse)(res, 200, "list of the users", 200, users);
        return;
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, error.message, 400);
        return;
    }
};
exports.searchUsers = searchUsers;
const createUser = async (req, res) => {
    const validationResponse = (0, validation_1.validateCreateUser)(req, res);
    if (validationResponse) {
        return;
    }
    const { fullName, email, status } = req.body;
    // Add validation logic here
    try {
        const findUser = models_1.default.User.findAll({ where: { fullName, email } });
        if (!findUser) {
            (0, response_1.errorResponse)(res, 400, "user already exits", 400);
            return;
        }
        const user = await models_1.default.User.create({ fullName, email, status });
        (0, response_1.successResponse)(res, 201, "created user.", 200, user);
        return;
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, error.message, 400);
        return;
    }
};
exports.createUser = createUser;
const updateUserStatus = async (req, res) => {
    const validationResponse = (0, validation_1.validateUpdateUserStatus)(req, res);
    if (validationResponse) {
        return;
    }
    const { id } = req.params;
    const { status } = req.body;
    try {
        const user = await models_1.default.User.findByPk(id);
        if (!user) {
            (0, response_1.errorResponse)(res, 404, "User not found", 404);
            return;
        }
        await user.update({ status });
        (0, response_1.successResponse)(res, 200, "User status updated", 200, []);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 400, error.message, 400);
    }
};
exports.updateUserStatus = updateUserStatus;
