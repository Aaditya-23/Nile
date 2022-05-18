import express from "express";
import {
  getNewReleases,
  getProducts,
} from "../../../controllers/api/v1/Products.js";

const router = express.Router();

router.get("/getProducts", getProducts);
router.get("/getNewReleases", getNewReleases);

export default router;
