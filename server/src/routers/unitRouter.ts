import express from "express";

import { handleValidationErrors } from "../middlewares/handleValidationMiddleware";
import { validateParameter, validateUnit } from "../validators/unitValidator";
import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";
import verifyCSRFToken from "../middlewares/verifyCSRFTokenMiddleware";
import verifyLandlord from "../middlewares/verifyLandlordMiddleware";

import { getUnits, addUnit, updateUnit, deleteUnit } from "../controllers/unitController";

const router = express.Router();

router.get("/api/v1/units", verifyJWTToken, verifyCSRFToken, getUnits);
router.post("/api/v1/unit", validateUnit, handleValidationErrors, verifyJWTToken, verifyCSRFToken,  verifyLandlord, addUnit);
router.put("/api/v1/unit/:unitId", validateParameter, validateUnit, handleValidationErrors, verifyJWTToken, verifyCSRFToken, verifyLandlord, updateUnit);
router.delete("/api/v1/unit/:unitId", validateParameter, handleValidationErrors, verifyJWTToken, verifyCSRFToken, verifyLandlord, deleteUnit);

export default router;