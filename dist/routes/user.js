import express from "express";
import { allUsers, newUser } from "../controllers/user.js";
const router = express.Router();
router.get("/", allUsers);
router.post("/newUser", newUser);
export default router;
//# sourceMappingURL=user.js.map