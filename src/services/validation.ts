import Joi from 'joi';
import { Request, Response } from 'express';

export const validateCreateUser = (req: Request, res: Response): Response | void => {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        status: Joi.string().valid('active', 'inactive').required(),
    });

    const { error , value} = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
};


export const validateList = (req: Request, res: Response): Response | void => {
    const schema = Joi.object({
        page: Joi.string().pattern(/^\d+$/).default('1'),
        limit: Joi.string().pattern(/^\d+$/).default('10')
    });

    const { error, value } = schema.validate(req.query);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Overwrite query with validated values
    req.query = value;
};

export const validateSearchUsers = (req: Request, res: Response): Response | void => {
    const schema = Joi.object({
        fullName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        status: Joi.string().valid('active', 'inactive').optional()
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Overwrite query with validated values
    req.query = value;
};

export const validateUpdateUserStatus = (req: Request, res: Response): Response | void => {
    const schema = Joi.object({
        id: Joi.string().required(),
        status: Joi.string().valid('active', 'inactive').required()
    });

    const { error, value } = schema.validate({ ...req.params, ...req.body });

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Overwrite params and body with validated values
    req.params = { id: value.id };
    req.body = { status: value.status };
};

// validators.ts

export const validateCreateAppointment = (req: Request, res: Response): Response | void => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        date: Joi.date().iso().required(),
        startTime: Joi.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: Joi.string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .custom((value: string, helpers) => {
                const startTime = new Date(`2022-01-01T${req.body.startTime}`);
                const endTime = new Date(`2022-01-01T${value}`);
                if (endTime <= startTime) {
                    return helpers.error('any.invalid');
                }
                return value;
            })
            .required()
    }).messages({
        'any.invalid': 'End time must be greater than start time'
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Overwrite body with validated values
    req.body = value;
};

export const validateSearchAppointments = (req: Request, res: Response): Response | void => {
    const schema = Joi.object({
        fullName: Joi.string().optional(),
        status: Joi.string().valid('active', 'inactive').optional(),
        date: Joi.date().iso().optional()
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Overwrite query with validated values
    req.query = value;
};