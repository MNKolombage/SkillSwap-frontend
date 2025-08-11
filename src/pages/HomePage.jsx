import Navbar from "../components/HomePage/Navbar";
import HeroSection from "../components/HomePage/HeroSection";
import WelcomeSection from "../components/HomePage/WelcomeSection";
import Footer from "../components/HomePage/Footer";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden" style={{ margin: 0, padding: 0 }}>
      {/* Navigation Header */}
      <Navbar />
      <WelcomeSection />
      <HeroSection />

      <Footer />
    </div>
  );
};

export default HomePage;