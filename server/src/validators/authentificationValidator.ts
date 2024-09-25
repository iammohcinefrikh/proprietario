import { body } from "express-validator";

const validateRegistration = [
  body("userEmail")
  .exists().withMessage("userEmail est nécessaire.")
  .notEmpty().withMessage("userEmail ne peut pas être vide.")
  .escape()
  .isEmail().withMessage("userEmail invalide.")
  .normalizeEmail()
  .isLength({ max: 64 }).withMessage("userEmail ne doit pas dépasser 64 caractères"),
  
  body("userPassword")
  .exists().withMessage("userPassword est nécessaire.")
  .notEmpty().withMessage("userPassword ne peut pas être vide.")
  .escape()
  .isStrongPassword().withMessage("userPassword doit comporter au moins 8 caractères et inclure une lettre majuscule, une lettre minuscule, un chiffre et un symbole.")
  .isLength({ max: 64 }).withMessage("userPassword ne doit pas dépasser 64 caractères"),
  
  body("userFirstName")
  .exists().withMessage("userFirstName est nécessaire.")
  .notEmpty().withMessage("userFirstName ne peut pas être vide.")
  .escape()
  .isString().withMessage("userFirstName doit être une chaîne de caractères.")
  .isLength({ min: 2, max: 32 }).withMessage("userFirstName ne doit pas comporter plus de 32 caractères et moins de 2 caractères."),
  
  body("userLastName")
  .exists().withMessage("userLastName est nécessaire.")
  .notEmpty().withMessage("userLastName ne peut pas être vide.")
  .escape()
  .isString().withMessage("userLastName doit être une chaîne de caractères.")
  .isLength({ min: 2, max: 32 }).withMessage("userLastName ne doit pas comporter plus de 32 caractères et moins de 2 caractères."),
  
  body("userType")
  .exists().withMessage("userType est nécessaire.")
  .notEmpty().withMessage("userType ne peut pas être vide.")
  .escape()
  .isString().withMessage("userType doit être une chaîne de caractères.")
  .isIn(["landlord", "tenant"]).withMessage("userType doit être soit \"landlord\", soit \"tenant\".")
];

const validateLogin = [
  body("userEmail")
  .exists().withMessage("userEmail est nécessaire.")
  .notEmpty().withMessage("userEmail ne peut pas être vide.")
  .escape()
  .isEmail().withMessage("Adresse e-mail invalide.")
  .normalizeEmail()
  .isLength({ max: 64 }).withMessage("userEmail ne doit pas dépasser 64 caractères"),

  body("userPassword")
  .exists().withMessage("userPassword est nécessaire.")
  .notEmpty().withMessage("userPassword ne peut pas être vide.")
  .escape()
  .isStrongPassword().withMessage("Le mot de passe doit comporter au moins 8 caractères et inclure une lettre majuscule, une lettre minuscule, un chiffre et un symbole.")
  .isLength({ max: 64 }).withMessage("userPassword ne doit pas dépasser 64 caractères")
];

const validateActivation  = [
  body("userId")
  .exists().withMessage("userId est nécessaire.")
  .notEmpty().withMessage("userId ne peut pas être vide.")
  .escape()
  .isString()
  .isInt({ allow_leading_zeroes: false }).withMessage("userId doit être un entier valide."),

  body("verificationToken")
  .exists().withMessage("userId est nécessaire.")
  .notEmpty().withMessage("userId ne peut pas être vide.")
  .escape()
  .isString()
  .isLength({ min: 64, max: 64 }).withMessage("verificationToken doit comporter exactement 64 caractères.")
  .matches(/^[A-Za-z0-9]+$/).withMessage("verificationToken doit contenir uniquement des caractères alphanumériques."),
];

export { validateRegistration, validateLogin, validateActivation };