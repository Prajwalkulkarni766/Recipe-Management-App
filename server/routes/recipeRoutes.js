const express = require('express');
const upload = require('../middleware/upload');
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const {
  validateRecipe,
  validateRecipeId,
  handleValidationErrors,
} = require('../middleware/recipeValidation');

const router = express.Router();

router.get('/', getRecipes);
router.get('/:name', getRecipeById);
router.post('/', upload, validateRecipe, handleValidationErrors, createRecipe);
router.put('/:id', upload, validateRecipeId, handleValidationErrors, validateRecipe, handleValidationErrors, updateRecipe);
router.delete('/:id', validateRecipeId, handleValidationErrors, deleteRecipe);

module.exports = router;
