
const { body, param, validationResult } = require('express-validator');
const { LIMITS } = require('../models/Recipe');

const toList = (value) => {
  if (value === undefined || value === null) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((item) => String(item).trim());
};

const validateRecipe = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isLength({ max: LIMITS.title })
    .withMessage(`Title must be ${LIMITS.title} characters or fewer`),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .bail()
    .isLength({ max: LIMITS.description })
    .withMessage(
      `Description must be ${LIMITS.description} characters or fewer`
    ),

  body('cuisine')
    .trim()
    .notEmpty()
    .withMessage('Cuisine is required')
    .bail()
    .isLength({ max: LIMITS.cuisine })
    .withMessage(`Cuisine must be ${LIMITS.cuisine} characters or fewer`),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .bail()
    .isLength({ max: LIMITS.category })
    .withMessage(`Category must be ${LIMITS.category} characters or fewer`),

  body('preparationTime')
    .isInt({ min: 1, max: LIMITS.minutes })
    .withMessage(
      `Preparation time must be a whole number between 1 and ${LIMITS.minutes}`
    )
    .toInt(),

  body('cookingTime')
    .isInt({ min: 1, max: LIMITS.minutes })
    .withMessage(
      `Cooking time must be a whole number between 1 and ${LIMITS.minutes}`
    )
    .toInt(),

  body('servings')
    .isInt({ min: 1, max: LIMITS.servings })
    .withMessage(
      `Servings must be a whole number between 1 and ${LIMITS.servings}`
    )
    .toInt(),

  body('ingredients')
    .customSanitizer(toList)
    .isArray({ min: 1, max: LIMITS.listItems })
    .withMessage(
      `Ingredients must contain between 1 and ${LIMITS.listItems} entries`
    )
    .bail()
    .custom((items) =>
      items.every(
        (item) => item.length > 0 && item.length <= LIMITS.ingredient
      )
    )
    .withMessage(
      `Ingredients entries must be non-empty and at most ${LIMITS.ingredient} characters`
    ),

  body('instructions')
    .customSanitizer(toList)
    .isArray({ min: 1, max: LIMITS.listItems })
    .withMessage(
      `Instructions must contain between 1 and ${LIMITS.listItems} entries`
    )
    .bail()
    .custom((items) =>
      items.every(
        (item) => item.length > 0 && item.length <= LIMITS.instruction
      )
    )
    .withMessage(
      `Instructions entries must be non-empty and at most ${LIMITS.instruction} characters`
    ),
];

const validateRecipeId = [
  param('id').custom((id) => {
    const valid = typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

    if (!valid) {
      throw new Error('Invalid recipe ID');
    }

    return true;
  }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((error) => error.msg).join(', '),
    });
  }

  next();
};

module.exports = {
  validateRecipe,
  validateRecipeId,
  handleValidationErrors,
};