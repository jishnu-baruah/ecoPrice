import { Request, Response, NextFunction } from 'express';
import { ProductCategory } from '../models/Product';
import { APIError } from './error';
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  const { minEcoRating, maxPrice, page, limit } = req.query;

  // Validate numeric values
  if (minEcoRating && (isNaN(Number(minEcoRating)) || Number(minEcoRating) < 0 || Number(minEcoRating) > 10)) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_INPUT',
      message: 'minEcoRating must be a number between 0 and 10'
    });
  }

  if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_INPUT',
      message: 'maxPrice must be a positive number'
    });
  }

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_INPUT',
      message: 'page must be a positive number'
    });
  }

  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_INPUT',
      message: 'limit must be a number between 1 and 100'
    });
  }

  // Validate category if provided
  const { category } = req.query;
  if (category && !Object.values(ProductCategory).includes(category as ProductCategory)) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_INPUT',
      message: 'Invalid category'
    });
  }

  next();
};

export const validateProductId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // Check if ID matches MongoDB ObjectId format
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_INPUT',
      message: 'Invalid product ID format'
    });
  }

  next();
};


export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;
  
    if (!email || !name || !password) {
      throw new APIError('Missing required fields', 400, 'VALIDATION_ERROR');
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new APIError('Invalid email format', 400, 'VALIDATION_ERROR');
    }
  
    // Validate password strength
    if (password.length < 8) {
      throw new APIError('Password must be at least 8 characters', 400, 'VALIDATION_ERROR');
    }
  
    next();
  };
  
  export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new APIError('Missing required fields', 400, 'VALIDATION_ERROR');
    }
  
    next();
  };
  
  export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { name, preferences } = req.body;
  
    if (!name && !preferences) {
      throw new APIError('No update data provided', 400, 'VALIDATION_ERROR');
    }
  
    if (preferences) {
      const { preferredCategories, sustainabilityPriorities } = preferences;
      
      if (preferredCategories && !Array.isArray(preferredCategories)) {
        throw new APIError('Preferred categories must be an array', 400, 'VALIDATION_ERROR');
      }
  
      if (sustainabilityPriorities && !Array.isArray(sustainabilityPriorities)) {
        throw new APIError('Sustainability priorities must be an array', 400, 'VALIDATION_ERROR');
      }
    }
  
    next();
  };

  
export const validatePost = (req: Request, res: Response, next: NextFunction) => {
    const { title, content, tags } = req.body;
  
    if (!title || !content) {
      throw new APIError('Missing required fields', 400, 'VALIDATION_ERROR');
    }
  
    if (title.length < 3 || title.length > 200) {
      throw new APIError('Title must be between 3 and 200 characters', 400, 'VALIDATION_ERROR');
    }
  
    if (content.length < 10 || content.length > 5000) {
      throw new APIError('Content must be between 10 and 5000 characters', 400, 'VALIDATION_ERROR');
    }
  
    if (tags && !Array.isArray(tags)) {
      throw new APIError('Tags must be an array', 400, 'VALIDATION_ERROR');
    }
  
    next();
  };
  
  export const validateComment = (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
  
    if (!content) {
      throw new APIError('Comment content is required', 400, 'VALIDATION_ERROR');
    }
  
    if (content.length < 1 || content.length > 500) {
      throw new APIError('Comment must be between 1 and 500 characters', 400, 'VALIDATION_ERROR');
    }
  
    next();
  };