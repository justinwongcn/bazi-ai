import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InputPage from './InputPage';
import ResultPage from './ResultPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 默认跳转到排盘输入页 */}
        <Route path="/" element={<InputPage />} />
        {/* 排盘结果页 */}
        <Route path="/result" element={<ResultPage />} />
        {/* 兜底路由 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
