import { Router } from "express";
const router = Router();
import userRoute from "./user.routes.js";

router.use("/user", userRoute);

export default router;
