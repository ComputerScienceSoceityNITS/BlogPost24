import { Schema, model, Types } from "mongoose";


const blogSchema = new Schema(
    {
        title: {
            type: "string",
            required: true,
        },
        body: {
            type: "string",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        },
        createdBy: {
            type: Types.ObjectId,
            // required: true,
        }
    }
)

const BlogSchema = model('blog', blogSchema);

export {BlogSchema}