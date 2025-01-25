import { Router } from "express";
import { authenticate } from "../utils/passport.js";
import { createPost, getPostById, getPosts, updatePost, deletePost } from "../controllers/postController.js";

const postRouter = Router();

postRouter.get('/', getPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', authenticate, createPost);
postRouter.put('/:id', authenticate, updatePost);
postRouter.delete('/:id', authenticate, deletePost);

export default postRouter;
