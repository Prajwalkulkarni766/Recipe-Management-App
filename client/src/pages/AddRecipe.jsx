import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { createRecipe } from '../api/recipes';

function AddRecipe() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const result = await createRecipe(formData);
    navigate(`/recipes/${result.data._id}`, { state: { message: result.message } });
  };

  return (
    <section className="mx-auto" style={{ maxWidth: 760 }}>
      <h1 className="mb-3">Add Recipe</h1>
      <RecipeForm submitLabel="Save Recipe" onSubmit={handleSubmit} />
    </section>
  );
}

export default AddRecipe;
