import express from "express";
import { User } from "../models/user.js";

export const allUsers = async (req: express.Request, res: express.Response) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) {
      res.status(400).send({
        message: "No Data",
        success: false,
      });
    }
    res.status(200).send({
      success: true,
      allUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      success: false,
    });
  }
};

export const newUser = async (req: express.Request, res: express.Response) => {
  try {
    const { name, userId, mobile } = req.body;
    const user = await User.findOne({ userId });
    if (user) {
      res.status(400).send({
        message: "user already exist.",
        success: false,
        user: user,
      });
    } else {
      const newUser = new User({
        name,
        userId,
        mobile,
      });
      if (!newUser) {
        res.status(500).send({
          message: "something wrong",
          success: false,
        });
      }
      await newUser.save();
      res.status(201).send({
        message: "user created",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      success: false,
    });
  }
};