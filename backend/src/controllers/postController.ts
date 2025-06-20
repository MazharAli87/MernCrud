import { Request, Response } from "express";
import Post from "../models/posts"

export async function getAllPosts (req:Request, res:Response)  {
    try {
        const posts = await Post.find().sort({ createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error });
    }
}

export const getPostById = async (req:Request, res:Response) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch the post", error });
    }
}

export const createPost = async (req:Request, res:Response) => {
    const {title, content} = req.body;
    try {
        const newPost = new Post({title, content});
        await newPost.save();

        res.status(200).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create the post", error});
    }
}

export const updatePost = async (req:Request, res:Response) => {
    const {title, content} = req.body;
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {title, content}, {runValidators: true, new: true});
        if(!post){
            res.json({
                message: "Post not found"
            })
        } else {
            res.status(200).json({post, message: "Post updated successfully"})
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to updated the post", error });
    }
}

export const deletePost = async (req:Request, res:Response) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        res.json({
        message: "Post deleted successfully"
    })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete the post", error });
    }
}