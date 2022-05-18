import express from "express";
import { getCategories } from "../../../controllers/api/v1/Categories.js";

const router = express.Router();

router.get("/getCategories", getCategories);

export default router;
