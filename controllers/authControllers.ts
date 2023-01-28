import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "@models";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user;
    const { email } = req.body;
    user = await UserModel.UserSchema.findOne({ email: email });
    if (user) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Email already in use",
      });
    }
    user = await UserModel.UserSchema.create(req.body);
    const accessToken = jwt.sign(user.toJSON(), <string>process.env.JWT_SECRET);
    return res.status(httpStatus.CREATED).json({
      user: user,
      accessToken: accessToken
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user;
    const { email, password } = req.body;
    user = await UserModel.UserSchema.findOne({ email: email });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "User with this email does not exist",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Password is incorrect",
      });
    }
    const accessToken = jwt.sign(user.toJSON(), <string>process.env.JWT_SECRET);
    return res.status(httpStatus.OK).json({
      user: user,
      accessToken: accessToken,
    });
  } catch (err) {
    return next(err);
  }
};

// const logout = async (req: Request, res: Response, next: NextFunction) => {

// }

// const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

// }

export { signup, login };
