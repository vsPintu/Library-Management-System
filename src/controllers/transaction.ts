import express from "express";
import { Transaction } from "../models/transaction.js";
import { Book } from "../models/book.js";
import { User } from "../models/user.js";

export const transactionDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { bookName } = req.query;
    if (!bookName) {
      res.status(400).send({
        success: false,
        message: "Missing require field.",
      });
    }
    const transactionByBookName = await Transaction.find({
      bookName: { $regex: bookName as string, $options: "i" },
    });

    const personNameIntoTransaction = transactionByBookName.map(
      (index) => index.personName
    );
    const userIdIntoTransaction = transactionByBookName.map(
      (index) => index.userId
    );

    const personsList = await User.find({
      $or: [
        { name: personNameIntoTransaction },
        { userId: userIdIntoTransaction },
      ],
    }).collation({ locale: "en", strength: 2 });

    const totalRentBySearchingBook = transactionByBookName
      .map((index) => index.rent)
      .reduce((total, rent: any) => {
        return total + rent;
      });

    if (!personsList) {
      res.status(404).send({
        success: false,
        message: "not found",
      });
    }
    const data = {
      totalRentBySearchingBook,
      personsList,
    };
    res.status(200).send({
      success: true,
      message: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const listOfBooksByUserNameAndUserId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { personName, userId } = req.query;
    if (!personName && !userId) {
      res.status(400).end({
        success: false,
        message: "Missing require field.",
      });
    }
    const transactionByPersonNameAndUserId = await Transaction.find({
      $or: [
        {
          personName: {
            $regex: personName || (userId as string),
            $options: "i",
          },
        },
        { userId: { $regex: personName || (userId as string), $options: "i" } },
      ],
    });
    console.log(transactionByPersonNameAndUserId);
    const listOfBooksByBookName = await Book.find({
      bookName: transactionByPersonNameAndUserId.map((index) => index.bookName),
    }).collation({ locale: "en", strength: 2 });
    if (!listOfBooksByBookName) {
      res.status(404).send({
        success: false,
        message: "book not found",
      });
    }
    res.status(200).send({
      success: true,
      message: listOfBooksByBookName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const listOfBooksByDateRange = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { minDate, maxDate } = req.query;
    if (!minDate || !maxDate) {
      res.status(400).send({
        success: false,
        message: "invalid input.",
      });
    }
    const transaction = await Transaction.find({
      issueDate: { $gte: minDate, $lte: maxDate },
    });
    const booksList = await Book.find({
      bookName: transaction.map((index) => index.bookName),
    }).collation({ locale: "en", strength: 2 });
    const user = await User.find({
      $or: [
        { name: transaction.map((index) => index.personName || index.userId) },
        {
          userId: transaction.map((index) => index.personName || index.userId),
        },
      ],
    });
    if (!booksList && !user) {
      res.status(404).send({
        success: false,
        message: "not found",
      });
    }
    const data = {
      booksList,
      user,
    };
    res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const newTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { bookName, personName, userId, issueDate } = req.query;
    if (!bookName || (!personName && !userId) || !issueDate) {
      return res
        .status(400)
        .send({ message: "Missing required fields", success: false });
    }

    const user = await User.findOne({
      $or: [{ name: personName }, { userId }],
    }).collation({ locale: "en", strength: 2 });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    const newTransaction = new Transaction({
      bookName,
      personName,
      userId,
      issueDate: new Date(issueDate as string),
    });
    if (!newTransaction) {
      return res
        .status(400)
        .send({ message: "something wrong.", success: false });
    }
    await newTransaction.save();
    res.status(201).send({
      message: "Book issued successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const returnBookTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { bookName, personName, userId, returnDate } = req.query;
    if (!bookName || (!personName && !userId) || !returnDate) {
      return res
        .status(400)
        .send({ message: "Missing required fields", success: false });
    }

    const user = await User.findOne({
      $or: [{ name: personName }, { userId }],
    }).collation({ locale: "en", strength: 2 });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    const transactionByUser = await Transaction.findOne({
      bookName,
      personName,
      userId,
      returnDate: null,
    }).collation({ locale: "en", strength: 2 });
    if (transactionByUser) {
      transactionByUser.returnDate = new Date(returnDate as string);
      const issueDate = new Date(transactionByUser.issueDate);
      const TotalRented = Math.ceil(
        (new Date(returnDate as string).getTime() - issueDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const bookRentPerDay: any = await Book.findOne({
        bookName: { $regex: bookName as string, $options: "i" },
      });
      transactionByUser.rent = TotalRented * bookRentPerDay?.rentPerDay;
      console.log();
      await transactionByUser.save();
      res.status(200).send({
        message: "Bool returned Successfully and Total Rent Generated.",
        rent: transactionByUser.rent,
      });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};
