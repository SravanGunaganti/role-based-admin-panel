import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

interface RoleRequest extends Request {
  user?: IUser;
}

export const authorizeRoles = (...roles: string[]) => {
  return (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role!)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};
