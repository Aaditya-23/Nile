import PasswordValidator from "password-validator";
import User from "../../../models/User.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });

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
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
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

    return res.status(200).json({
      token: jwt.sign(user.toJSON(), "secret", { expiresIn: "48h" }),
      user: JSON.stringify(user),
    });
  } catch (error) {
    console.log(`Error creating session: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Errror" });
  }
};
