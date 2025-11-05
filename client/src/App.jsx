import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Control from './pages/Control.jsx';
import Display from './pages/Display.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/control" element={<Control />} />
      <Route path="/display" element={<Display />} />
      <Route path="*" element={<Navigate to="/control" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
