import express from "express";
import api_v1 from "./v1/index.js";

const router = express.Router();

router.use("/v1", api_v1);

export default router;