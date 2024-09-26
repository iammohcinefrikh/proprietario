import express from "express";

import { registrationValidator, loginValidator, accountActivationValidator, invitationCheckValidator, invitationConfirmationValidator } from "../validators/authentificationValidator";
import { handleValidationErrors } from "../middlewares/handleValidationMiddleware";
import { register, login, verify, activate, check, confirm } from "../controllers/authentificationController";
import verifyJWTToken from "../middlewares/verifyJWTTokenMiddleware";

const router = express.Router();

router.post("/api/v1/user/register", registrationValidator, handleValidationErrors, register);
router.post("/api/v1/user/login", loginValidator, handleValidationErrors, login);
router.post("/api/v1/session/verify", verifyJWTToken, verify);
router.post("/api/v1/account/activate", accountActivationValidator, handleValidationErrors, activate);
router.post("/api/v1/invitation/check", invitationCheckValidator, handleValidationErrors, check);
router.post("/api/v1/invitation/confim", invitationConfirmationValidator, handleValidationErrors, confirm);

export default router;