// middlewares.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Replace with your actual secret or import from config/environment
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define what your JWT payload looks like
export interface JwtPayload {
  id: number;
  email: string;
  role: 'freelancer' | 'client';
}

// Extend Express Request
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Authentication middleware
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);

    (req as any).user = decoded; // bypass TS check
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Role-based authorization middleware
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export default { authMiddleware, authorizeRoles, errorHandler };