import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "@models";
import { Types } from "mongoose";
const nodemailer = require('nodemailer');
require('dotenv').config();

//creating nodemailer variables
const transporter = nodemailer.createTransport({
  host : 'smtp.gmail.com',
  port : 465,
  secure : true,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
var mailOptions = {
  from: process.env.EMAIL,
  subject: 'Email Verification',
  text: '',
  to : ''
};


const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user;
    if(process.env.EMAIL === undefined || process.env.PASSWORD === undefined) {}
    else
    console.log(process.env.EMAIL + process.env.PASSWORD)
    const { email } = req.body;
    user = await UserModel.UserSchema.findOne({ email: email });
    if (user) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Email already in use",
      });
    }
    user = await UserModel.UserSchema.create(req.body);
    const accessToken = jwt.sign(user.toJSON(), <string>process.env.JWT_SECRET);
    mailOptions.to = email;
    mailOptions.text = `Click on the link below to verify your email http://localhost:${process.env.PORT}/auth/verifyEmail/${email}/${accessToken}`;
    transporter.sendMail(mailOptions, ()=>{});
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

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, resetToken } = req.params;
    const user = await UserModel.UserSchema.findById(new Types.ObjectId(id));
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found. Please try again!"
      })
    }
    const secret = <string>process.env.JWT_SECRET + user._id;
    const payload = jwt.verify(resetToken, secret);
    if (!payload) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Incorrect token received"
      })
    }
    user.password = req.body.password;
    await user.save();
    return res.status(httpStatus.OK).json({
      user: user,
      message: "Password updated successfully"
    })
  }
  catch (err) {
    return next(err);
  }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await UserModel.UserSchema.findOne({ email: email });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "User doesn't exist with this email"
      })
    }
    const secret = <string>process.env.JWT_SECRET + user.email;
    const resetToken = jwt.sign(user.toJSON(), secret, { expiresIn: '10m' })
  
    return res.status(httpStatus.OK).json({
      resetToken: resetToken,
      link: `http://localhost:${process.env.PORT}/auth/:${user.email}/resetPassword/:${resetToken}`,
    });
  }
  catch (err) {
    return next(err);
  }
}

//write a function to verify email
const verifyEmail = async (req: Request, res: Response, next : NextFunction) => {
  try {
    const { id, verifyToken } = req.params;
    console.log(id, verifyToken);
    const user = await UserModel.UserSchema.findOne({ email : id });
    
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found. Please try again!"
      })
    }
    const secret = <string>process.env.JWT_SECRET;
    const payload = jwt.verify(verifyToken, secret);
    if (!payload) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Incorrect token received"
      })
    }
    user.verified = true;
    await user.save();
    return res.status(httpStatus.OK).json({
      user: user,
      message: "Email verified successfully"
    })
  }
  catch (err) {
    return next(err);
  }
}

export { signup, login, resetPassword, forgotPassword, verifyEmail};
