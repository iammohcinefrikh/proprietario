import express from "express";

import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";
import verifyCSRFToken from "../middlewares/verifyCSRFTokenMiddleware";
import verifyTenant from "../middlewares/verifyTenantMiddleware";

import getLandlords from "../controllers/landlordController";

const router = express.Router();

router.get("/api/v1/landlords", verifyJWTToken, verifyCSRFToken, verifyTenant, getLandlords);

export default router;