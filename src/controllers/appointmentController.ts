import { Request, Response } from "express";
import db from "../models";
const { Op } = require("sequelize");

import {
  validateList,
  validateCreateAppointment,
  validateSearchAppointments,
} from "../services/validation";
import { errorResponse, successResponse } from "../services/response";

export const listAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationResponse = validateList(req, res);
  if (validationResponse) {
    return;
  }
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  try {
    const appointments = await db.Appointment.findAndCountAll({
      limit: Number(limit),
      offset,
    });
    successResponse(res, 200, "list of the appointments", 200, appointments);
    return;
  } catch (error) {
    errorResponse(res, 400, (error as Error).message, 400);
    return;
  }
};

export const searchAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationResponse = validateSearchAppointments(req, res);
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
      const dateString = date as string; // Assert type to string
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

    const appointments = await db.Appointment.findAll({
      include: [
        {
          model: db.User,
          where: whereClause, // Apply the constructed whereClause to the User model
        },
      ],
      where: whereDate, // Apply the same whereClause for appointments
    });

    successResponse(res, 200, "list of the appointments", 200, appointments);
    return;
  } catch (error) {
    errorResponse(res, 400, (error as Error).message, 400);
    return;
  }
};


export const createAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationResponse = validateCreateAppointment(req, res);
  if (validationResponse) {
    return;
  }
  const { userId, date, startTime, endTime } = req.body;
  // Add validation logic here
  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      errorResponse(res, 400, "User is not exits", 400);
      return;
    }
    let dataValues = user.dataValues;

    if (!user || dataValues.status !== "active") {
      errorResponse(res, 400, "User is not Active", 400);
      return;
    }

    // Check for conflicting appointments
    const existingAppointments = await db.Appointment.findAll({
      where: { date, userId },
    });
    if (existingAppointments.length > 0) {
      errorResponse(res, 400, "User can book only 1 appointment per day", 400);
      return;
    }

    const appointment = await db.Appointment.create({
      userId,
      date,
      startTime,
      endTime,
    });
    successResponse(res, 201, "created appointment.", 200, appointment);
    return;
  } catch (error) {
    errorResponse(res, 400, (error as Error).message, 400);
    return;
  }
};
