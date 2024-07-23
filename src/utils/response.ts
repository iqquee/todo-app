import { Response } from 'express';

// successResponse handles all success responses sent to the end users
export function successResponse(
    status: number,
    message: string,
    data: any,
    error: string | null,
    res: Response
): Response {
    return res.status(status).json({
        message: message,
        data: data,
        error: error,
    });
}

// errorResponse handles all error responses sent to the end users
export function errorResponse(status: number,
    message: string,
    error: string,
    res: Response
): Response {
    return res.status(status).json({
        message: message,
        data: null,
        error: error,
    });
}