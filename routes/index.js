import express from "express";
import { Home } from "../controllers/HomeController.js";
import api from "./api/index.js";

const router = express.Router();

router.get("/", Home);
router.use("/api", api);

export default router;
