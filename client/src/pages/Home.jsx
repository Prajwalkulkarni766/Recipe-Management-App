import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { deleteRecipe, getErrorMessage, getRecipes } from '../api/recipes';

function Home() {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ cuisines: [], categories: [] });
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [deletingId, setDeletingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const hasFilters = Boolean(search.trim() || cuisine || category);

  useEffect(() => {
    if (location.state?.message) window.history.replaceState({}, '');
  }, [location.state]);

  useEffect(() => {
    let ignore = false;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await getRecipes({ search: search.trim(), cuisine, category });
        if (!ignore) {
          setRecipes(result.data);
          setFilterOptions(result.filters);
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search, cuisine, category, reloadKey]);

  const clearFilters = () => {
    setSearch('');
    setCuisine('');
    setCategory('');
  };

  const handleDelete = async (recipe) => {
    if (!window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) return;

    setDeletingId(recipe._id);
    setMessage('');
    setError('');
    try {
      await deleteRecipe(recipe._id);
      setMessage(`"${recipe.title}" was deleted.`);
      setRecipes((current) => current.filter((item) => item._id !== recipe._id));
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-body-secondary py-5">
          <div className="spinner-border mb-2" aria-hidden="true" />
          <p>Loading recipes...</p>
        </div>
      );
    }

    if (recipes.length === 0 && hasFilters) {
      return (
        <div className="text-center bg-white border rounded p-5">
          <h2>No matching recipes</h2>
          <p className="text-body-secondary">Try a different search term or clear the filters.</p>
          <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>Clear filters</button>
        </div>
      );
    }

    if (recipes.length === 0 && !error) {
      return (
        <div className="text-center bg-white border rounded p-5">
          <h2>No recipes yet</h2>
          <p className="text-body-secondary">Start your collection by adding your first recipe.</p>
          <Link to="/recipes/new" className="btn btn-primary">Add a recipe</Link>
        </div>
      );
    }

    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {recipes.map((recipe) => (
          <div className="col" key={recipe._id}>
            <RecipeCard
              recipe={recipe}
              onDelete={handleDelete}
              isDeleting={deletingId === recipe._id}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="mb-4">
        <h1>Recipes</h1>
        <p className="text-body-secondary mb-0">Browse, cook and manage your saved recipes.</p>
      </section>

      <div className="row g-2 mb-4">
        <div className="col-12 col-lg-6">
          <input
            type="search"
            className="form-control"
            placeholder="Search by title..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search recipes by title"
          />
        </div>
        <div className="col-6 col-lg-2">
          <select className="form-select" value={cuisine} onChange={(event) => setCuisine(event.target.value)} aria-label="Filter by cuisine">
            <option value="">All cuisines</option>
            {filterOptions.cuisines.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-lg-2">
          <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
            <option value="">All categories</option>
            {filterOptions.categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-lg-2 d-grid">
          <button type="button" className="btn btn-outline-secondary" onClick={clearFilters} disabled={!hasFilters}>
            Clear
          </button>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {renderContent()}
    </>
  );
}

export default Home;
