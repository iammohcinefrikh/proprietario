import express from "express";

import { handleValidationErrors } from "../middlewares/handleValidationMiddleware";
import { validateParameter, validateTenantCreation, validateTenantModification } from "../validators/tenantValidator";
import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";
import verifyCSRFToken from "../middlewares/verifyCSRFTokenMiddleware";

import { getTenants, addTenant, updateTenant, deleteTenant, inviteTenant } from "../controllers/tenantController";

const router = express.Router();

router.get("/api/v1/tenants", verifyJWTToken, verifyCSRFToken, getTenants);
router.post("/api/v1/tenant", validateTenantCreation, handleValidationErrors, verifyJWTToken, verifyCSRFToken, addTenant);
router.post("/api/v1/invite-tenant/:tenantId", validateParameter, handleValidationErrors, verifyJWTToken, verifyCSRFToken, inviteTenant);
router.put("/api/v1/tenant/:tenantId", validateParameter, validateTenantModification, handleValidationErrors, verifyJWTToken, verifyCSRFToken, updateTenant);
router.delete("/api/v1/tenant/:tenantId", validateParameter, handleValidationErrors, verifyJWTToken, verifyCSRFToken, deleteTenant);

export default router;