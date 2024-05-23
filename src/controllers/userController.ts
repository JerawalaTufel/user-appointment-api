import { Request, Response } from "express";
import db from "../models";

import {
  validateCreateUser,
  validateList,
  validateSearchUsers,
  validateUpdateUserStatus,
} from "../services/validation";
import { errorResponse, successResponse } from "../services/response";

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const validationResponse = validateList(req, res);
  if (validationResponse) {
    return;
  }
  const { page = "1", limit = "10" } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  try {
    const users = await db.User.findAndCountAll({
      limit: Number(limit),
      offset,
    });

    successResponse(res, 200, "list of the users", 200, users);
    return;
  } catch (error) {
    errorResponse(res, 400, (error as Error).message, 400);
    return;
  }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationResponse = validateSearchUsers(req, res);
  if (validationResponse) {
    return;
  }

  const { fullName, email, status } = req.query as {
    fullName?: string;
    email?: string;
    status?: string;
  };
  try {
    let whereClause: any = {};
    if (fullName) whereClause.fullName = fullName;
    if (email) whereClause.email = email;
    if (status) whereClause.status = status;

    let users;
    // If all values are undefined, find all users
    if (!fullName && !email && !status) {
      users = await db.User.findAll();
    } else {
      users = await db.User.findAll({ where: whereClause });
    }

    successResponse(res, 200, "list of the users", 200, users);
    return;
  } catch (error) {
    errorResponse(res, 400, (error as Error).message, 400);
    return;
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationResponse = validateCreateUser(req, res);

  if (validationResponse) {
    return;
  }
  const { fullName, email, status } = req.body as {
    fullName: string;
    email: string;
    status: string;
  };
  // Add validation logic here
  try {
    const findUser = db.User.findAll({ where: { fullName, email } });
    if (!findUser) {
      errorResponse(res, 400, "user already exits", 400);
      return;
    }

    const user = await db.User.create({ fullName, email, status });

    successResponse(res, 201, "created user.", 200, user);
    return;
  } catch (error) {
    errorResponse(res, 400, (error as Error).message, 400);
    return;
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationResponse = validateUpdateUserStatus(req, res);

  if (validationResponse) {
    return;
  }
  const { id } = req.params;
  const { status } = req.body as { status: string };
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      errorResponse(res, 404, "User not found", 404);
      return;
    }
    await user.update({ status });

    successResponse(res, 200, "User status updated", 200, []);
  } catch (error) {
    errorResponse(res, 400, (error as Error).message, 400);
  }
};
