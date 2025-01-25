import { Router } from "express";
import { authenticate } from "../utils/passport.js";
import { getComments, createComment, deleteComment } from "../controllers/commentController.js";

const commentRouter = Router();

commentRouter.get('/posts/:postId/comments', getComments);
commentRouter.post('/posts/:postId/comments',authenticate ,createComment);
commentRouter.delete('/comments/:id', authenticate, deleteComment);

export default commentRouter;
