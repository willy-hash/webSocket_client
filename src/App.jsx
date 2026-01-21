import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Page1 from './components/Page1';
import Page2 from './components/Page2';



function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Page 1</Link>
          <Link to="/page2" className="nav-link">Dashboard</Link>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
