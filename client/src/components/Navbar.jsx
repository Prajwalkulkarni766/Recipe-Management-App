import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar bg-white border-bottom">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-primary">Recipe Box</Link>
        <Link to="/recipes/new" className="btn btn-primary">+ Add Recipe</Link>
      </div>
    </nav>
  );
}

export default Navbar;
