import { Router } from "express";
import { get_history } from "../controllers/history.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { get_history_by_id } from "../controllers/history.controller.js";
import { delete_history_by_id } from "../controllers/history.controller.js";

const router = Router();

router.get("/get_history", protect, get_history);

router.get("/get_history_by_id/:id", protect, get_history_by_id)

router.delete("/delete_history_by_id/:id", protect, delete_history_by_id)

export default router;
