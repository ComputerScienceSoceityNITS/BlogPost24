import { Router } from "express";
import { authControllers } from "@controllers";

const router = Router();

router.post('/signup', authControllers.signup)
router.post("/login", authControllers.login);
// router.get("/logout", authControllers.logout);
router.post('/forgotPassword', authControllers.forgotPassword)
router.post('/resetPassword/:id/:resetToken', authControllers.resetPassword)

export {router}