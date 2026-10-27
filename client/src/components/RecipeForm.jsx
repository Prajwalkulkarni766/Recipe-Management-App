import { useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/recipes';
import InputField from './InputField';
import NumberField from './NumberField';
import ListInputField from './ListInputField';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const TEXT_FIELDS = [
  { name: 'title', label: 'Title', maxLength: 100 },
  { name: 'cuisine', label: 'Cuisine', maxLength: 50, placeholder: 'e.g. Italian' },
  { name: 'category', label: 'Category', maxLength: 50, placeholder: 'e.g. Dessert' },
  { name: 'slug', label: 'Slug', maxLength: 50, placeholder: 'e.g. puranpoli' },
];

const NUMBER_FIELDS = [
  { name: 'preparationTime', label: 'Prep time (minutes)', max: 10080 },
  { name: 'cookingTime', label: 'Cooking time (minutes)', max: 10080 },
  { name: 'servings', label: 'Servings', max: 100 },
];

const LIST_FIELDS = [
  {
    name: 'ingredients',
    label: 'Ingredients',
    placeholder: 'e.g. 2 cups flour',
    multiline: false,
  },
  {
    name: 'instructions',
    label: 'Instructions',
    placeholder: 'Describe this step',
    multiline: true,
  },
];

function getInitialValues(recipe) {
  return {
    title: recipe?.title || '',
    description: recipe?.description || '',
    cuisine: recipe?.cuisine || '',
    category: recipe?.category || '',
    preparationTime: recipe?.preparationTime?.toString() || '',
    cookingTime: recipe?.cookingTime?.toString() || '',
    servings: recipe?.servings?.toString() || '',
    ingredients: recipe?.ingredients?.length ? [...recipe.ingredients] : [''],
    instructions: recipe?.instructions?.length ? [...recipe.instructions] : [''],
    slug: recipe?.slug || ''
  };
}

function validate(values) {
  const errors = {};

  for (const field of TEXT_FIELDS) {
    if (!values[field.name].trim()) errors[field.name] = `${field.label} is required`;
  }
  if (!values.description.trim()) errors.description = 'Description is required';

  for (const field of NUMBER_FIELDS) {
    const number = Number(values[field.name]);
    if (!values[field.name] || !Number.isInteger(number) || number < 1) {
      errors[field.name] = 'Enter a whole number greater than 0';
    } else if (number > field.max) {
      errors[field.name] = `Cannot be more than ${field.max}`;
    }
  }

  if (values.ingredients.some((item) => !item.trim())) {
    errors.ingredients = 'Fill in or remove empty ingredients';
  }
  if (values.instructions.some((item) => !item.trim())) {
    errors.instructions = 'Fill in or remove empty steps';
  }

  return errors;
}

function RecipeForm({ initialRecipe, submitLabel, onSubmit }) {
  const [values, setValues] = useState(() => getInitialValues(initialRecipe));
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const setField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleChange = (event) => setField(event.target.name, event.target.value);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setErrors((current) => ({ ...current, image: undefined }));

    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((current) => ({ ...current, image: 'Choose a JPEG, PNG or WebP image' }));
      event.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({ ...current, image: 'Image must be 5 MB or smaller' }));
      event.target.value = '';
      return;
    }
    setImageFile(file);
  };

  const clearImage = () => {
    setImageFile(null);
    fileInputRef.current.value = '';
  };

  const buildFormData = () => {
    const formData = new FormData();
    for (const [name, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(name, item.trim()));
      } else {
        formData.append(name, value.trim());
      }
    }
    if (imageFile) formData.append('image', imageFile);
    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitError('');
    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Please fix the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(buildFormData());
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  const currentImage = previewUrl || initialRecipe?.image?.url;

  return (
    <form className="card card-body p-4 shadow-sm" onSubmit={handleSubmit} noValidate>
      {submitError && <div className="alert alert-danger">{submitError}</div>}

      <div className="row g-3 mb-4">
        {TEXT_FIELDS.map((field) => (
          <InputField
            key={field.name}
            field={field}
            values={values}
            errors={errors}
            onChange={handleChange}
          />
        ))}

        <div className="col-12">
          <label htmlFor="description" className="form-label fw-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            rows={3}
            maxLength={1000}
            value={values.description}
            onChange={handleChange}
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        {NUMBER_FIELDS.map((field) => (
          <NumberField
            key={field.name}
            field={field}
            values={values}
            errors={errors}
            onChange={handleChange}
          />
        ))}
      </div>

      {LIST_FIELDS.map((field) => (
        <ListInputField
          key={field.name}
          label={field.label}
          items={values[field.name]}
          error={errors[field.name]}
          placeholder={field.placeholder}
          multiline={field.multiline}
          onChange={(items) => setField(field.name, items)}
        />
      ))}

      <div className="mb-4">
        <label htmlFor="image" className="form-label fw-semibold">Recipe image (optional)</label>
        {currentImage && (
          <img
            className="d-block img-fluid rounded object-fit-cover mb-3"
            style={{ width: 320, aspectRatio: '4 / 3' }}
            src={currentImage}
            alt="Recipe preview"
          />
        )}
        <input
          id="image"
          ref={fileInputRef}
          type="file"
          className={`form-control ${errors.image ? 'is-invalid' : ''}`}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
        />
        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
        <div className="form-text mb-2">JPEG, PNG or WebP, up to 5 MB.</div>
        {imageFile && (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearImage}>
            {initialRecipe?.image?.url ? 'Keep current image' : 'Remove selected image'}
          </button>
        )}
      </div>

      <div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
