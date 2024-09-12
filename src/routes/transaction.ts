import express from "express";
import {
  listOfBooksByUserNameAndUserId,
  newTransaction,
  returnBookTransaction,
  transactionDetails,
  // listOfBooksByDateRange,
} from "../controllers/transaction.js";

const router = express.Router();

router.get("/", transactionDetails);
router.get("/booksListByPersonDetail", listOfBooksByUserNameAndUserId);
// router.get("/booksListByDateRange", listOfBooksByDateRange);
router.post("/issue-book", newTransaction);
router.post("/return-book", returnBookTransaction);

export default router;
