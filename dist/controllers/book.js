var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Book } from "../models/book.js";
export const allBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookName, minRent, maxRent, category } = req.query;
        const filter = {};
        if (bookName) {
            filter.bookName = { $regex: bookName, $options: "i" };
        }
        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }
        if (minRent && maxRent) {
            filter.rentPerDay = { $gte: minRent, $lte: maxRent };
        }
        const allBooks = yield Book.find(filter);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: error,
            success: false,
        });
    }
});
export const entryNewBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookName, category, rentPerDay } = req.body;
        const bookAvailable = yield Book.findOne({ bookName });
        if (bookAvailable) {
            res.status(400).send({
                message: "this details already exist.",
                success: false,
                book: bookAvailable,
            });
        }
        else {
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
            yield newBook.save();
            res.status(201).send({
                message: "Book Added.",
                success: true,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: error,
            success: false,
        });
    }
});
//# sourceMappingURL=book.js.map