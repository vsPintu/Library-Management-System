var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Transaction } from "../models/transaction.js";
import { Book } from "../models/book.js";
import { User } from "../models/user.js";
export const transactionDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookName } = req.query;
        if (!bookName) {
            res.status(400).send({
                success: false,
                message: "Missing require field.",
            });
        }
        const transactionByBookName = yield Transaction.find({
            bookName: { $regex: bookName, $options: "i" },
        });
        const personNameIntoTransaction = transactionByBookName.map((index) => index.personName);
        const userIdIntoTransaction = transactionByBookName.map((index) => index.userId);
        const personsList = yield User.find({
            $or: [
                { name: personNameIntoTransaction },
                { userId: userIdIntoTransaction },
            ],
        }).collation({ locale: "en", strength: 2 });
        const totalRentBySearchingBook = transactionByBookName
            .map((index) => index.rent)
            .reduce((total, rent) => {
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
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
export const listOfBooksByUserNameAndUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { personName, userId } = req.query;
        if (!personName && !userId) {
            res.status(400).send({
                success: false,
                message: "Missing require field.",
            });
        }
        const transactionByPersonNameAndUserId = yield Transaction.find();
        console.log(transactionByPersonNameAndUserId);
        const listOfBooksByBookName = yield Book.find({
            bookName: transactionByPersonNameAndUserId.map((index) => index.bookName),
        });
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
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
// export const listOfBooksByDateRange = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { minDate, maxDate } = req.query;
//     if (!minDate || !maxDate) {
//       res.status(400).send({
//         success: false,
//         message: "invalid input.",
//       });
//     }
//     const transaction = await Transaction.find({
//       issueDate: { $gte: minDate, $lte: maxDate },
//     });
//     const booksList = await Book.find({
//       _id: transaction.map((index) => index.bookDetailsId),
//     });
//     const findTransactionByBookId = await Transaction.find({
//       bookDetailsId: booksList.map((index) => index._id),
//     });
//     const user = await User.find({
//       _id: transaction.map((index) => index.userDetailsId),
//     });
//     if (!booksList && !user) {
//       res.status(404).send({
//         success: false,
//         message: "not found",
//       });
//     }
//     const data = {
//       booksList,
//       user,
//     };
//     res.status(200).send({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: error,
//     });
//   }
// };
export const newTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookName, personName, userId, issueDate } = req.query;
        if (!bookName || (!personName && !userId) || !issueDate) {
            return res
                .status(400)
                .send({ message: "Missing required fields", success: false });
        }
        const user = yield User.findOne({
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
            issueDate: new Date(issueDate),
        });
        if (!newTransaction) {
            return res
                .status(400)
                .send({ message: "something wrong.", success: false });
        }
        yield newTransaction.save();
        res.status(201).send({
            message: "Book issued successfully",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
export const returnBookTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookName, personName, userId, returnDate } = req.query;
        if (!bookName || (!personName && !userId) || !returnDate) {
            return res
                .status(400)
                .send({ message: "Missing required fields", success: false });
        }
        const user = yield User.findOne({
            $or: [{ name: personName }, { userId }],
        }).collation({ locale: "en", strength: 2 });
        if (!user) {
            return res
                .status(404)
                .send({ message: "User not found", success: false });
        }
        const transactionByUser = yield Transaction.findOne({
            bookName,
            personName,
            userId,
            returnDate: null,
        }).collation({ locale: "en", strength: 2 });
        if (transactionByUser) {
            transactionByUser.returnDate = new Date(returnDate);
            const issueDate = new Date(transactionByUser.issueDate);
            const TotalRented = Math.ceil((new Date(returnDate).getTime() - issueDate.getTime()) /
                (1000 * 60 * 60 * 24));
            const bookRentPerDay = yield Book.findOne({
                bookName: { $regex: bookName, $options: "i" },
            });
            transactionByUser.rent = TotalRented * (bookRentPerDay === null || bookRentPerDay === void 0 ? void 0 : bookRentPerDay.rentPerDay);
            console.log();
            yield transactionByUser.save();
            res.status(200).send({
                message: "Bool returned Successfully and Total Rent Generated.",
                rent: transactionByUser.rent,
            });
        }
        else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
//# sourceMappingURL=transaction.js.map