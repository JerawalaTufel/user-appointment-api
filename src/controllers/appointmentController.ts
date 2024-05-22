import { Request, Response } from 'express';
const {
    Model
  } = require('sequelize');

  import {validateList , validateCreateAppointment , validateSearchAppointments} from '../services/validation'

export const listAppointments = async (req: Request, res: Response): Promise<void> => {

    const validationResponse = validateList(req, res);
    if (validationResponse) {
        return;
    }
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const appointments = await Model.Appointment.findAndCountAll({ limit: Number(limit), offset });
  res.json(appointments);
};

export const searchAppointments = async (req: Request, res: Response): Promise<void> => {

    const validationResponse = validateSearchAppointments(req, res);
    if (validationResponse) {
        return;
    }
  const { fullName, status, date } = req.query;
  // Implement search logic here
  const appointments = await Model.Appointment.findAll({
    include: [{
      model: Model.User,
      where: { fullName, status }
    }],
    where: { date }
  });
  res.json(appointments);
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {

    const validationResponse = validateCreateAppointment(req, res);
    if (validationResponse) {
        return;
    }  
    const { userId, date, startTime, endTime } = req.body;
  // Add validation logic here
  try {
    const user = await Model.User.findByPk(userId);
    if (!user || user.status !== 'active') {
        res.status(400).json({ error: 'User is not Active' });

    }

    // Check for conflicting appointments
    const existingAppointments = await Model.Appointment.findAll({ where: { date, userId } });
    if (existingAppointments.length > 0) {
       res.status(400).json({ error: 'User can book only 1 appointment per day' });
       return;
    }

    const appointment = await Model.Appointment.create({ userId, date, startTime, endTime });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};