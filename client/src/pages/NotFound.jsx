import { Link }from "react-router-dom"

export default function NotFound() {
  return (
    <div className="text-center bg-white border rounded p-5">
      <h2>Page not found</h2>
      <p className="text-body-secondary">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Back to recipes</Link>
    </div>
  );
}