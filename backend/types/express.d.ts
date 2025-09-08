import { User } from "../models/User"; // adjust path

declare global {
  namespace Express {
    interface Request {
      user?: User; // user object from auth middleware
    }
  }
}
