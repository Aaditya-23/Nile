import express from "express";
import { createUser, createSession } from "../../../controllers/api/v1/User.js";

const router = express.Router();

router.post("/createUser", createUser);
router.post("/createSession", createSession);

export default router;
