import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderPage from './page/Order/OrderPage';
import ManageMenuPage from './page/Menu/ManageMenuPage';
import ManageTablePage from './page/Table/ManageTablePage';
import OrderFood from './page/Order/[id]';
import HistoryOrder from './page/Order/HistoryOrder';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<OrderPage />} />
          <Route path="/manage-menu" element={<ManageMenuPage />} />
          <Route path="/manage-table" element={<ManageTablePage />} />
          <Route path="/order/:id" element={<OrderFood />} />
          <Route path="/order-history" element={<HistoryOrder />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
