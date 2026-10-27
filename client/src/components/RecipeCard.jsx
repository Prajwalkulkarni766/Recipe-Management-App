import { Link } from 'react-router-dom';
import { formatMinutes } from '../utils/time';

function RecipeCard({ recipe, onDelete, isDeleting }) {
  return (
    <article className="card h-100 shadow-sm">
      <Link to={`/recipes/${recipe.slug}`} className="ratio ratio-4x3">
        <img
          className="card-img-top object-fit-cover bg-body-secondary"
          src={recipe.image?.url || '/placeholder.svg'}
          alt={recipe.title}
          loading="lazy"
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <div className="d-flex flex-wrap gap-1 mb-2">
          <span className="badge rounded-pill text-bg-warning">{recipe.cuisine}</span>
          <span className="badge rounded-pill text-bg-light border">{recipe.category}</span>
        </div>
        <h3 className="card-title h5">
          <Link to={`/recipes/${recipe.slug}`} className="link-body-emphasis text-decoration-none">
            {recipe.title}
          </Link>
        </h3>
        <p className="card-text text-body-secondary text-truncate">{recipe.description}</p>
        <p className="small text-body-secondary mb-0">
          Prep {formatMinutes(recipe.preparationTime)} · Cook {formatMinutes(recipe.cookingTime)}
        </p>
        <div className="d-flex gap-2 mt-auto pt-3">
          <Link to={`/recipes/${recipe.slug}`} className="btn btn-sm btn-outline-primary">View</Link>
          <Link to={`/recipes/${recipe._id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(recipe)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
