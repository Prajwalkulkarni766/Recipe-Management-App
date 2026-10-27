import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteRecipe, getErrorMessage, getRecipe, getRecipeByName } from '../api/recipes';
import { formatMinutes, formatDate } from '../utils/time';

function RecipeDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message] = useState(location.state?.message || '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (location.state?.message) window.history.replaceState({}, '');
  }, [location.state]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError('');

    getRecipeByName(name)
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
  }, [name]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    setError('');
    try {
      await deleteRecipe(recipe._id);
      navigate('/', { state: { message: `"${recipe.title}" was deleted.` } });
    } catch (err) {
      setError(getErrorMessage(err));
      setIsDeleting(false);
    }
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

  const wasUpdated = new Date(recipe.updatedAt).getTime() - new Date(recipe.createdAt).getTime() > 1000;

  const facts = [
    ['Prep time', formatMinutes(recipe.preparationTime)],
    ['Cook time', formatMinutes(recipe.cookingTime)],
    ['Total time', formatMinutes(recipe.preparationTime + recipe.cookingTime)],
    ['Servings', recipe.servings],
  ];

  return (
    <article className="mx-auto" style={{ maxWidth: 880 }}>
      <Link to="/" className="d-inline-block mb-3 link-secondary text-decoration-none">← Back to recipes</Link>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <img
        className="w-100 rounded object-fit-cover bg-body-secondary mb-4"
        style={{ maxHeight: 440 }}
        src={recipe.image?.url || '/placeholder.svg'}
        alt={recipe.title}
      />

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-3">
        <div>
          <div className="d-flex flex-wrap gap-1 mb-2">
            <span className="badge rounded-pill text-bg-warning">{recipe.cuisine}</span>
            <span className="badge rounded-pill text-bg-light border">{recipe.category}</span>
          </div>
          <h1>{recipe.title}</h1>
          <p className="lead text-body-secondary">{recipe.description}</p>
        </div>
        <div className="d-flex gap-2 flex-shrink-0">
          <Link to={`/recipes/${recipe._id}/edit`} className="btn btn-outline-secondary">Edit</Link>
          <button type="button" className="btn btn-outline-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <dl className="row row-cols-2 row-cols-md-4 g-0 border rounded overflow-hidden bg-white my-4">
        {facts.map(([label, value]) => (
          <div className="col p-3" key={label}>
            <dt className="small fw-normal text-body-secondary">{label}</dt>
            <dd className="mb-0 fw-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      {console.log("recipe", recipe)}

      <div className="row g-4">
        <section className="col-md-4">
          <h2 className="h4">Ingredients</h2>
          <ul className="list-group list-group-flush">
            {recipe?.ingredients.map((ingredient, index) => (
              <li className="list-group-item bg-transparent px-0" key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>
        <section className="col-md-8">
          <h2 className="h4">Instructions</h2>
          <ol className="list-group list-group-numbered">
            {recipe?.instructions.map((step, index) => (
              <li className="list-group-item" key={index}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <p className="small text-body-secondary border-top mt-4 pt-3">
        Added {formatDate(recipe.createdAt)}
        {wasUpdated && ` · Updated ${formatDate(recipe.updatedAt)}`}
      </p>
    </article>
  );
}

export default RecipeDetails;
