import express from "express";

import { handleValidationErrors } from "../middlewares/handleValidationMiddleware";
import { validateParameter, validateTenancy } from "../validators/tenancyValidator";
import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";
import verifyCSRFToken from "../middlewares/verifyCSRFTokenMiddleware";

import { getTenancies, addTenancy, updateTenancy, deleteTenancy } from "../controllers/tenancyController";

const router = express.Router();

router.get("/api/v1/tenancies", verifyJWTToken, verifyCSRFToken, getTenancies);
router.post("/api/v1/tenacy", validateTenancy, handleValidationErrors, verifyJWTToken, verifyCSRFToken, addTenancy);
router.put("/api/v1/tenancy/:tenancyId", validateParameter, validateTenancy, handleValidationErrors, verifyJWTToken, verifyCSRFToken, updateTenancy);
router.delete("/api/v1/tenancy/:tenancyId", validateParameter, handleValidationErrors, verifyJWTToken, verifyCSRFToken, deleteTenancy);

export default router;