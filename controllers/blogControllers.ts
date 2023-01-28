import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { BlogModel } from '@models'
import { PaginatedResults } from '@services'


const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blog = await BlogModel.BlogSchema.create(req.body);
        return res.status(httpStatus.CREATED).json({
            blog: blog,
            message: "Blog was created successfully"
        })
    }
    catch (err) {
        return next(err)
    }
}

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const blogId = new Types.ObjectId(req.params.id);
        await BlogModel.BlogSchema.deleteOne({ __id: blogId });
        return res.status(httpStatus.OK).json({
            message: "Blog was successfully deleted"
        })
    }
    catch (err) {
        return next(err);
    }
}

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {;
        const blogId = new Types.ObjectId(req.params.id);
        const blog = await BlogModel.BlogSchema.findByIdAndUpdate(blogId, req.body)
        return res.status(httpStatus.OK).json({
            blog: blog,
            message: "Blog was updated successfully"
        })
    }
    catch (err) {
        return next(err);
    }
}

const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = new Types.ObjectId(req.params.id);
        const blog = await BlogModel.BlogSchema.findById(blogId);
        if (!blog) {
            return res.status(httpStatus.BAD_REQUEST)
        }
        return res.status(httpStatus.OK).json({
            blog: blog
        })
    }
    catch (err) {
        return next(err);
    }
}

const getAllBlogs = async ( req:Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await PaginatedResults.paginatedResults(
          BlogModel.BlogSchema,
          <string>req.query.page,
          <string>req.query.limit
        );
        return res.status(httpStatus.OK).json({
            blogs: blogs
        })
    }
    catch (err) {
        return next(err);
    }
}

export {createBlog, deleteBlog, updateBlog, getBlogById, getAllBlogs}