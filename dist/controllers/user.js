var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/user.js";
export const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield User.find();
        if (!allUsers) {
            res.status(400).send({
                message: "No Data",
                success: false,
            });
        }
        res.status(200).send({
            success: true,
            allUsers,
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
export const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, userId, mobile } = req.body;
        const user = yield User.findOne({ userId });
        if (user) {
            res.status(400).send({
                message: "user already exist.",
                success: false,
                user: user,
            });
        }
        else {
            const newUser = new User({
                name,
                userId,
                mobile,
            });
            if (!newUser) {
                res.status(500).send({
                    message: "something wrong",
                    success: false,
                });
            }
            yield newUser.save();
            res.status(201).send({
                message: "user created",
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
//# sourceMappingURL=user.js.map