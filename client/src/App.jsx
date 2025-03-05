import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderPage from './page/Order/OrderPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<OrderPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
