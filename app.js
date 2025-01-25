import express from "express";
import authRoute from "./routes/authRoutes.js";
import passport from "./utils/passport.js";

const app = express();

app.use(passport.initialize());

app.use(express.json());

app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
