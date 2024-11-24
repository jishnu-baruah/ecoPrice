import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { rateLimit } from 'express-rate-limit';
import User, { IUser } from '../models/User';
import { Types } from 'mongoose';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Type for token generation
interface TokenUser {
  _id: Types.ObjectId | string;
  email: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Authentication token is required'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Verify user still exists
    const userExists = await User.exists({ _id: decoded.userId });
    if (!userExists) {
      return res.status(401).json({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'User no longer exists'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 401,
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired'
      });
    }
    return res.status(401).json({
      status: 401,
      code: 'INVALID_TOKEN',
      message: 'Invalid token'
    });
  }
};

export const generateToken = (user: TokenUser) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn
    }
  );
};

// Rate limiting configurations
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again after 15 minutes'
});