import express from 'express';
import { listUsers, searchUsers, createUser, updateUserStatus } from '../controllers/userController';
import { listAppointments, searchAppointments, createAppointment } from '../controllers/appointmentController';

const apiRoute = express.Router();

// Route to list users
apiRoute.get('/users', listUsers);

// Route to search users
apiRoute.get('/users/search', searchUsers);

// Route to create a new user
apiRoute.post('/users', createUser);

// Route to update user status
apiRoute.put('/users/:id', updateUserStatus);


// Route to list appointments
apiRoute.get('/appointments', listAppointments);

// Route to search appointments
apiRoute.get('/appointments/search', searchAppointments);

// Route to create a new appointment
apiRoute.post('/appointments', createAppointment);

export default apiRoute;
