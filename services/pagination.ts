import mongoose from "mongoose";

const paginatedResults = async (model: typeof mongoose.Model, pageS: string, limitS: string = '10') => {
    const page = parseInt(pageS);
    const limit = parseInt(limitS);

    const startIndex = (page - 1) * limit;

    const results = await model.find().limit(limit).skip(startIndex).exec();
    return results;
}

export {paginatedResults}