import express from "express";
import { allBooks, entryNewBook } from "../controllers/book.js";
const router = express.Router();
router.get("/", allBooks);
router.post("/new-book-entry", entryNewBook);
export default router;
//# sourceMappingURL=book.js.map