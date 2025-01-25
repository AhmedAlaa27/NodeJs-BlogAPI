import express from "express";
import authRoute from "./routes/authRoutes.js";
import { passport, authenticate } from "./utils/passport.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRoutes.js";

const app = express();

app.use(passport.initialize());

app.use(express.json());

app.use('/api/auth', authRoute);

app.get('/api/protected', authenticate, (req, res) => {
    res.json({ message: 'You accessed a protected route!', user: req.user });
});

app.use('/api/posts', postRouter);

app.use('/api', commentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
