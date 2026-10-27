import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="bg-body-tertiary min-vh-100">
      <Navbar />
      <main className="container py-4 pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes/new" element={<AddRecipe />} />
          <Route path="/recipes/:name" element={<RecipeDetails />} />
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
