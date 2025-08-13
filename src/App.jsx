import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginSignup from "./pages/LoginSignup";

const App = () => {
  const location = useLocation();

  // List of routes that need simple green background (without center)
  const greenPages = ["/user/parking-booking", "/history", "/about/us", "/admin", "/admin/team-management", "/messaging", "/admin/reviews-ratings"];

  // Check if current page matches
  const isSimpleGreenPage = greenPages.includes(location.pathname);

  const containerClass = isSimpleGreenPage
    ? "min-h-screen bg-green-100"
    : "min-h-screen bg-green-100 flex items-center justify-center";

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </div>
  );
}

export default App;
