import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InputPage from './InputPage';
import ResultPage from './ResultPage';
import DetailPage from './DetailPage';
import ProPage from './ProPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/pro" element={<ProPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
