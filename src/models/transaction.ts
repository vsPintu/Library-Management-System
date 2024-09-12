import mongoose, { Schema } from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    personName: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: "",
    },
    issueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    rent: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model("transaction", transactionSchema);
