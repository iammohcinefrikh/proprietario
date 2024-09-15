import express from "express";

import { validateRegistration, validateLogin } from "../validators/authentificationValidator";

import { handleValidationErrors } from "../middlewares/handleValidationMiddleware";
import { register, login, verify } from "../controllers/authentificationController";
import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";

const router = express.Router();

router.post("/api/v1/register", validateRegistration, handleValidationErrors, register);
router.post("/api/v1/login", validateLogin, handleValidationErrors, login);
router.post("/api/v1/verify", verifyJWTToken, verify);

export default router;