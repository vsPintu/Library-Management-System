import express from "express";
import dotenv from "dotenv";
import { connectDatabaseUserAndBook } from "./dbConnection/dbConnection.js";
import userRouter from "./routes/user.js";
import bookRouter from "./routes/book.js";
import transactionRouter from "./routes/transaction.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectDatabaseUserAndBook();
app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/transactions", transactionRouter);
app.listen(port, () => {
    console.log(`server running at ${port}`);
});
//# sourceMappingURL=app.js.map