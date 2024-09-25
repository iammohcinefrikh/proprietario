import { param, body } from "express-validator";

const validateParameter = [
  param("tenantId")
  .exists().withMessage("Le paramètre tenantId doit être fourni.")
  .notEmpty().withMessage("Le paramètre tenantId ne peut pas être vide.")
  .escape()
  .isInt().withMessage("Le paramètre tenantId doit être un nombre entier.")
];

const validateTenantCreation = [
  body("tenantFirstName")
    .exists().withMessage("tenantFirstName est nécessaire.")
    .notEmpty().withMessage("tenantFirstName ne peut pas être vide.")
    .escape()
    .isString().withMessage("tenantFirstName doit être une chaîne de caractères.")
    .isLength({ max: 32 }).withMessage("tenantFirstName est trop long, veuillez en saisir un plus court."),

  body("tenantLastName")
    .exists().withMessage("tenantLastName est nécessaire.")
    .notEmpty().withMessage("tenantLastName ne peut pas être vide.")
    .escape()
    .isString().withMessage("tenantLastName doit être une chaîne de caractères.")
    .isLength({ max: 32 }).withMessage("tenantLastName est trop long, veuillez en saisir un plus court."),

  body("tenantPhoneNumber")
    .exists().withMessage("tenantPhoneNumber est nécessaire.")
    .notEmpty().withMessage("tenantPhoneNumber ne peut pas être vide.")
    .escape()
    .matches(/^0[5-9]\d{8}$/).withMessage("tenantPhoneNumber doit être au format 0XXXXXXXXX."),

  body("tenantEmail")
    .exists().withMessage("tenantEmail est requise.")
    .notEmpty().withMessage("tenantEmail ne peut pas être vide.")
    .escape()
    .isEmail().withMessage("tenantEmail doit être une adresse email valide."),

  body("tenantIsInvited")
    .exists().withMessage("tenantIsInvited est nécessaire.")
    .escape()
    .isBoolean().withMessage("tenantIsInvited doit être un booléen.")
];

const validateTenantModification = [
  body("tenantFirstName")
    .exists().withMessage("tenantFirstName est nécessaire.")
    .notEmpty().withMessage("tenantFirstName ne peut pas être vide.")
    .escape()
    .isString().withMessage("tenantFirstName doit être une chaîne de caractères.")
    .isLength({ max: 32 }).withMessage("tenantFirstName est trop long, veuillez en saisir un plus court."),

  body("tenantLastName")
    .exists().withMessage("tenantLastName est nécessaire.")
    .notEmpty().withMessage("tenantLastName ne peut pas être vide.")
    .escape()
    .isString().withMessage("tenantLastName doit être une chaîne de caractères.")
    .isLength({ max: 32 }).withMessage("tenantLastName est trop long, veuillez en saisir un plus court."),

  body("tenantPhoneNumber")
    .exists().withMessage("tenantPhoneNumber est nécessaire.")
    .notEmpty().withMessage("tenantPhoneNumber ne peut pas être vide.")
    .escape()
    .matches(/^0[5-9]\d{8}$/).withMessage("tenantPhoneNumber doit être au format 0XXXXXXXXX.")
];

export { validateParameter, validateTenantCreation, validateTenantModification };