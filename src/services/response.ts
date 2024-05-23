import { Response } from 'express';

interface SuccessResponseData {
    status: string;
    data: any;
    message: string;
}

interface ErrorResponseData {
    status: string;
    message: string;
}

export const successResponse = (
    res: Response, 
    status: number, 
    message: string, 
    messageStatus: number, 
    data: any
): Response<SuccessResponseData> => {
    return res.status(status).send({
        status: messageStatus,
        data: data,
        message: message.replace(/"/g, '')
    });
}

export const errorResponse = (
    res: Response, 
    status: number, 
    message: string, 
    messageStatus: number
): Response<ErrorResponseData> => {
    return res.status(status).send({
        status: messageStatus,
        message: message.replace(/"/g, '')
    });
}
