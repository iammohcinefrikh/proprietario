import express from "express";

import { handleValidationErrors } from "../middlewares/handleValidationMiddleware";
import { validateParameter, validateProperty } from "../validators/propertyValidator";
import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";
import verifyCSRFToken from "../middlewares/verifyCSRFTokenMiddleware";

import { getProperties, addProperty, updateProperty, deleteProperty } from "../controllers/propertyController";

const router = express.Router();

router.get("/api/v1/properties", verifyJWTToken, verifyCSRFToken, getProperties);
router.post("/api/v1/property", validateProperty, handleValidationErrors, verifyJWTToken, verifyCSRFToken, addProperty);
router.put("/api/v1/property/:propertyId", validateParameter, validateProperty, handleValidationErrors, verifyJWTToken, verifyCSRFToken, updateProperty);
router.delete("/api/v1/property/:propertyId", validateParameter, handleValidationErrors, verifyJWTToken, verifyCSRFToken, deleteProperty);

export default router;