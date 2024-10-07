import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import './App.css'
import Dashboard from "./pages/Dashboard/Dashboard"
import { BrowserRouter as Router,Route, Routes } from "react-router-dom"
import Portfolio from "./pages/Portfolio/Portfolio"


const App = () => {
  return (
    <Router>
      <div className="wrapper">
        <Header />
        <main className="content">
          <section className="main-section">
            {/* Define Routes for different pages */}
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} /> 
              
            </Routes>
          </section>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
