import express from "express";
import { Book } from "../models/book.js";

export const allBooks = async (req: express.Request, res: express.Response) => {
  try {
    const { bookName, minRent, maxRent, category } = req.query;
    const filter: any = {};
    if (bookName) {
      filter.bookName = { $regex: bookName as string, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category as string, $options: "i" };
    }
    if (minRent && maxRent) {
      filter.rentPerDay = { $gte: minRent, $lte: maxRent };
    }
    const allBooks = await Book.find(filter);
    if (!allBooks) {
      res.status(400).send({
        message: "No Data",
        success: false,
      });
    }
    res.status(200).send({
      success: true,
      allBooks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      success: false,
    });
  }
};

export const entryNewBook = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { bookName, category, rentPerDay } = req.body;
    const bookAvailable = await Book.findOne({ bookName });
    if (bookAvailable) {
      res.status(400).send({
        message: "this details already exist.",
        success: false,
        book: bookAvailable,
      });
    } else {
      const newBook = new Book({
        bookName,
        category,
        rentPerDay,
      });
      if (!newBook) {
        res.status(500).send({
          message: "something wrong",
          success: false,
        });
      }
      await newBook.save();
      res.status(201).send({
        message: "Book Added.",
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
