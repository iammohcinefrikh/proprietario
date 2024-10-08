import express from "express";

import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";
import verifyCSRFToken from "../middlewares/verifyCSRFTokenMiddleware";
import verifyLandlord from "../middlewares/verifyLandlordMiddleware";

import getStats from "../controllers/statsController";

const router = express.Router();

router.get("/api/v1/stats", verifyJWTToken, verifyCSRFToken, verifyLandlord, getStats);

export default router;