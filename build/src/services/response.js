"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, status, message, messageStatus, data) => {
    return res.status(status).send({
        status: messageStatus,
        data: data,
        message: message.replace(/"/g, '')
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, status, message, messageStatus) => {
    return res.status(status).send({
        status: messageStatus,
        message: message.replace(/"/g, '')
    });
};
exports.errorResponse = errorResponse;
