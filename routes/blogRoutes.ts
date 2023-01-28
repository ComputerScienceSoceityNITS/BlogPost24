import { Router } from "express";
import { blogControllers } from "@controllers";
import { AuthMiddleware } from "@middlewares";

const router = Router();

router.get('/all', blogControllers.getAllBlogs);
router.post('/create', AuthMiddleware.authenticateToken, blogControllers.createBlog);
router.delete(
  "/delete/:id",
  AuthMiddleware.authenticateToken, blogControllers.deleteBlog
);
router.put(
  "/update/:id",
  AuthMiddleware.authenticateToken, blogControllers.updateBlog
);
router.get("/:id", AuthMiddleware.authenticateToken, blogControllers.getBlogById);

export {router}