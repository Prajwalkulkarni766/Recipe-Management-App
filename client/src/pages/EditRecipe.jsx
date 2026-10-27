import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { getErrorMessage, getRecipe, updateRecipe } from '../api/recipes';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError('');

    getRecipe(id)
      .then((data) => {
        if (!ignore) setRecipe(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    const result = await updateRecipe(id, formData);
    navigate(`/recipes/${id}`, { state: { message: result.message } });
  };

  if (isLoading) {
    return (
      <div className="text-center text-body-secondary py-5">
        <div className="spinner-border mb-2" aria-hidden="true" />
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center bg-white border rounded p-5">
        <h2>Recipe unavailable</h2>
        <p className="text-body-secondary">{error}</p>
        <Link to="/" className="btn btn-outline-secondary">Back to recipes</Link>
      </div>
    );
  }

  return (
    <section className="mx-auto" style={{ maxWidth: 760 }}>
      <Link to={`/recipes/${id}`} className="d-inline-block mb-3 link-secondary text-decoration-none">← Back to recipe</Link>
      <h1 className="mb-3">Edit Recipe</h1>
      <RecipeForm initialRecipe={recipe} submitLabel="Save Changes" onSubmit={handleSubmit} />
    </section>
  );
}

export default EditRecipe;
