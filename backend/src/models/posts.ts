import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('POST', postSchema);