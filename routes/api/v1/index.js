import express from "express";
import User from "./User.js";
import Products from "./Products.js";
import Categories from "./Categories.js";
const router = express.Router();

router.use("/user", User);
router.use("/products", Products);
router.use("/categories", Categories);

export default router;
