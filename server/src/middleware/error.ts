import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';

// Custom error class
export class APIError extends Error {
  constructor(
    message: string,
    readonly status: number = 500,
    readonly code: string = 'INTERNAL_ERROR',
    readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIError';
    
    // Maintain proper prototype chain
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

// Type guard to check if error is MongoError
function isMongoError(error: any): error is MongoError {
  return error instanceof MongoError || error.name === 'MongoError';
}

// Type guard for mongoose validation error
function isMongooseValidationError(error: any): error is mongoose.Error.ValidationError {
  return error instanceof mongoose.Error.ValidationError;
}

// Error handler middleware
export const errorHandler = (
  err: Error | APIError | MongoError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // MongoDB Duplicate Key Error
  if (isMongoError(err) && err.code === 11000) {
    return res.status(409).json({
      status: 409,
      code: 'DUPLICATE_ERROR',
      message: 'Duplicate entry found',
      details: (err as any).keyValue // Type assertion for keyValue
    });
  }

  // Mongoose Validation Error
  if (isMongooseValidationError(err)) {
    return res.status(400).json({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 401,
      code: 'INVALID_TOKEN',
      message: 'Invalid token'
    });
  }

  // Custom API Error
  if (err instanceof APIError) {
    return res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
      details: err.details
    });
  }

  // Default Error
  return res.status(500).json({
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  });
};

// Helper function to create API errors
export const createAPIError = (
  message: string,
  status: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: Record<string, any>
): APIError => {
  return new APIError(message, status, code, details);
};

// Common error types
export const CommonErrors = {
  NotFound: (resource: string) => 
    new APIError(`${resource} not found`, 404, 'NOT_FOUND'),
  
  Unauthorized: () => 
    new APIError('Unauthorized access', 401, 'UNAUTHORIZED'),
  
  BadRequest: (message: string) => 
    new APIError(message, 400, 'BAD_REQUEST'),
  
  Forbidden: () => 
    new APIError('Access forbidden', 403, 'FORBIDDEN'),
  
  ValidationError: (details: Record<string, any>) => 
    new APIError('Validation failed', 400, 'VALIDATION_ERROR', details),
  
  DatabaseError: (message: string) => 
    new APIError(message, 500, 'DATABASE_ERROR')
};