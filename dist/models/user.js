import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: Number,
        required: true,
        maxLength: 10,
    }
}, {
    timestamps: true
});
export const User = mongoose.model("user", userSchema);
//# sourceMappingURL=user.js.map