import { Request, Response, NextFunction } from "express"
import httpStatus from "http-status";
import jwt, { Secret } from "jsonwebtoken";

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(httpStatus.UNAUTHORIZED).json({
    message: "User not authenticated"
  });

  jwt.verify(token, <Secret>process.env.JWT_SECRET, (err): Response | void => {
    if (err) return res.status(httpStatus.FORBIDDEN).json({
      message: "Invalid token. Please sign in and try again"
    });
    next();
  });
};

export {authenticateToken}