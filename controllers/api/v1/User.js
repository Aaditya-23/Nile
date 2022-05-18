import PasswordValidator from "password-validator";
import User from "../../../models/User.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadImage, imageURL } from "../../../models/User.js";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const __dirname = path.resolve();
const unlinkAsync = promisify(fs.unlink);

const GenerateToken = (user) => {
  // TODO: CHANGE SECRET KEY
  return jwt.sign(user.toJSON(), "secret", { expiresIn: "48h" });
};

export const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });

    const schema = new PasswordValidator();

    schema
      .is()
      .min(8)
      .is()
      .max(200)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits(3)
      .has()
      .symbols();

    const validation = schema.validate(req.body.password, { details: true });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else if (req.body.password != req.body.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    } else if (validation.length > 0) {
      return res.status(400).json({ message: validation[0].message });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    newUser.password = undefined;
    newUser.wishlist = undefined;
    newUser.cart = undefined;

    return res.status(201).json({
      message: "User created successfully",
      token: GenerateToken(newUser),
      user: newUser,
    });
  } catch (error) {
    console.log(`Error in creating user: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createSession = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    user.password = undefined;
    user.wishlist = undefined;
    user.cart = undefined;

    return res.status(200).json({
      token: GenerateToken(user),
      user,
    });
  } catch (error) {
    console.log(`Error creating session: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Errror" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email }).lean();

    if (!user) return res.status(401).json({ message: "Unauthenticated" });

    user.password = undefined;
    user.wishlist = undefined;
    user.cart = undefined;

    return res.status(200).json({ user });
  } catch (error) {
    console.log(`Error getting user: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  uploadImage(req, res, async function () {
    try {
      const user = await User.findOne({ email: req.email });

      if (!user) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.gender = req.body.gender;
      user.address = req.body.address;

      if (req.file) {
        if (user.avatarUrl)
          await unlinkAsync(path.join(__dirname, user.avatarUrl));
        user.avatarUrl = imageURL + "/" + req.file.filename;
      }

      await user.save();

      return res.status(201).json({ user });
    } catch (error) {
      console.log(`Error occured while updating the user, ${error.message}`);
      return res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  });
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email });

    if (!user) return res.status(401).json({ message: "Unauthenticated" });

    return res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.log(`Error in fetching the wishlist: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    if (req.body.productId) {
      if (user.wishlist.includes(req.body.productId)) {
        user.wishlist = await user.wishlist.filter((id) => {
          return id != req.body.productId;
        });
      } else {
        await user.wishlist.push(req.body.productId);
      }

      await user.save();
    }

    return res
      .status(201)
      .json({ message: "Wishlist Updated", wishlist: user.wishlist });
  } catch (error) {
    console.log(`Error updating the wishlist: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email });

    if (!user) return res.status(401).json({ message: "Unauthenticated" });

    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.log(`Error in fetching the cart: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email });

    if (!user) return res.status(401).json({ message: "Unauthenticated" });

    const { quantity, _id } = req.body;
    const { cart } = user;

    const indx = (() => {
      for (let i = 0; i < cart.length; i++) if (cart[i]._id === _id) return i;
      return -1;
    })();

    if (!_id || typeof quantity != "number" || quantity < 0 || quantity > 5)
      return res
        .status(400)
        .json({ message: "Invalid product id or quantity", cart });

    if (quantity === 0) {
      if (indx !== -1) {
        cart.splice(indx, 1);
        await user.save();
      }
    } else if (indx === -1) {
      cart.push({ _id, quantity });
      await user.save();
    } else if (indx !== -1) {
      cart[indx].quantity = quantity;
      await user.save();
    }

    return res.status(201).json({ cart });
  } catch (error) {
    console.log(`Error in updating the cart: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
