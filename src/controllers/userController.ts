import { Request, Response } from 'express';
const {
    Model
  } = require('sequelize');
  import {validateCreateUser , validateList , validateSearchUsers , validateUpdateUserStatus} from '../services/validation'


export const listUsers = async (req: Request, res: Response): Promise<void> => {

    const validationResponse = validateList(req, res);
    if (validationResponse) {
        return;
    }
  const { page = '1', limit = '10' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  try {
    const users = await Model.User.findAndCountAll({ limit: Number(limit), offset });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {

    const validationResponse = validateSearchUsers(req, res);
    if (validationResponse) {
        return;
    }

  const { fullName, email, status } = req.query as { fullName?: string; email?: string; status?: string };
  try {
    const users = await Model.User.findAll({ where: { fullName, email, status } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    
    const validationResponse = validateCreateUser(req ,res);

    if (validationResponse) { 
        return;
    }
  const { fullName, email, status } = req.body as { fullName: string; email: string; status: string };
  // Add validation logic here
  try {
    const user = await Model.User.create({ fullName, email, status });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    
    const validationResponse = validateUpdateUserStatus(req ,res);
    
    if (validationResponse) { 
        return;
    }  const { id } = req.params;
  const { status } = req.body as { status: string };
  try {
    const user = await Model.User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    await user.update({ status });
    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

