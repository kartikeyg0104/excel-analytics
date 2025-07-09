import { Router } from "express";
import {
    createUser,
    connectUser,
    requestReset,
    confirmReset,
} from "../controllers/auth.controller.js";

const authRoutes = Router();
authRoutes
    .post("/register", createUser)
    .post("/login", connectUser)
    .post("/forgot-password", requestReset)
    .post("/reset-password/:token", confirmReset);
export default authRoutes;