import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    rentPerDay: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
});
export const Book = mongoose.model("book", bookSchema);
//# sourceMappingURL=book.js.map