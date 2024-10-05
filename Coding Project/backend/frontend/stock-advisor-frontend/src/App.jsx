import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import './App.css'
import Dashboard from "./pages/Dashboard/Dashboard"

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <main className="content">
        {/* Main page content goes here */}
        <section className="main-section">
          <Dashboard />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
