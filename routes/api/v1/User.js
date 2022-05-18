import express from "express";
import {
  createSession,
  createUser,
  getCart,
  getUser,
  getWishlist,
  updateCart,
  updateUser,
  UpdateWishlist,
} from "../../../controllers/api/v1/User.js";
import Authenticate from "../../../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/createUser", createUser);
router.post("/createSession", createSession);
router.get("/getUser", Authenticate, getUser);
router.post("/updateUser", Authenticate, updateUser);
router.get("/getWishlist", Authenticate, getWishlist);
router.post("/updateWishlist", Authenticate, UpdateWishlist);
router.get("/getCart", Authenticate, getCart);
router.post("/updateCart", Authenticate, updateCart);

export default router;
