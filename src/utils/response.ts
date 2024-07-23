import { Response } from 'express';

// successResponse handles all success responses sent to the end users
export function successResponse(
    res: Response,
    status: number,
    message: string,
    data: any,
): Response {
    return res.status(status).json({
        message: message,
        data: data,
        error: null,
    });
}

// errorResponse handles all error responses sent to the end users
export function errorResponse(
    res: Response,
    status: number,
    message: string,
    error: string,
): Response {
    return res.status(status).json({
        message: message,
        data: null,
        error: error,
    });
}