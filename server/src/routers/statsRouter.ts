import express from "express";

import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";
import verifyCSRFToken from "../middlewares/verifyCSRFTokenMiddleware";

import getStats from "../controllers/statsController";

const router = express.Router();

router.get("/api/v1/stats", verifyJWTToken, verifyCSRFToken, getStats);

export default router;