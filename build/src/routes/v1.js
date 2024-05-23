"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const appointmentController_1 = require("../controllers/appointmentController");
const apiRoute = express_1.default.Router();
// Route to list users
apiRoute.get('/users', userController_1.listUsers);
// Route to search users
apiRoute.get('/users/search', userController_1.searchUsers);
// Route to create a new user
apiRoute.post('/users', userController_1.createUser);
// Route to update user status
apiRoute.put('/users/:id', userController_1.updateUserStatus);
// Route to list appointments
apiRoute.get('/appointments', appointmentController_1.listAppointments);
// Route to search appointments
apiRoute.get('/appointments/search', appointmentController_1.searchAppointments);
// Route to create a new appointment
apiRoute.post('/appointments', appointmentController_1.createAppointment);
exports.default = apiRoute;
