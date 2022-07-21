import mongoose from "mongoose";
import postMessage from "../models/postMessage.js";
import router from "../routes/posts.js";

export const getPosts = async (req, res) => {
    try {
        const postMessages = await postMessage.find();

        console.log(postMessages);

        res.status(200).json(postMessages);
    }
    catch (error) {
        res.status(404).json({message: error.message});
    }
};

export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new postMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id:_id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    
    const updatedPost = await postMessage.findByIdAndUpdate(_id, { ...post, _id}, { new: true});

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await postMessage.findByIdAndRemove(id);

    res.json({ message: 'Post Deleted Successfully'})
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.json({ message: 'Unathenticated'})

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await postMessage.findById(id);

    const index = post.likes.findInex((id) => id == String(req.userId))

    if(index == -1){
        //like
        post.likes.push(req.userId)
    } else {
        //dislike
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await postMessage.findByIdAndUpdate(id, post, {new: true})

    res.json(updatedPost)
}
