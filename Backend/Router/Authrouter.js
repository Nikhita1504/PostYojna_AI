const express = require("express");
const authrouter = express.Router();
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/db");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

authrouter.post("/login", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "user doesnot exist",
        succes: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ user }, "123");

    res
      .status(200)
      .json({ message: "Login successful", success: true, jwt_token: token });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      success: false,
    });
  }
});

const signupValidation = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

authrouter.post("/signup", signupValidation, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user is already exist, you can login",
        succes: false,
      });
    }
    const UserModell = new UserModel({
      name,
      email,
      password,
    });
    UserModell.password = await bcrypt.hash(password, 10);
    await UserModell.save();
    res.status(201).json({ message: "signup successfully", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", err, success: false });
  }
});

module.exports = { authrouter };
