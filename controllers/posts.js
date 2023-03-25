import mongoose from "mongoose";
import postMessage from "../models/postMessage.js";
import router from "../routes/posts.js";

export const getPosts = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT //Get the starting index of every page
        const total = await postMessage.countDocuments({})

        const posts = await postMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);
        console.log(posts);

        res.status(200).json({data: posts, currentPage: Number(page), numberOFPages: Math.ceil(total / LIMIT)});
    }
    catch (error) {
        res.status(404).json({message: error.message});
    }
};

export const getPostsBySearch = async(req, res) => {
    const { searchQuery, tags} = req.query

    try {
        const title = new RegExp(searchQuery, 'i')

        const posts = await postMessage.find({ $or: [ {title}, {tags: {$in: tags.split(',')}}] })
        
        res.json({ data: posts})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

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

    const index = post.likes.findIndex((id) => id == String(req.userId))

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
