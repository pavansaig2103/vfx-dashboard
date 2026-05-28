import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ShotTracker from './pages/ShotTracker';
import AddShot from './pages/AddShot';
import ShotDetails from './pages/ShotDetails';
import CalendarPage from './pages/CalendarPage';
import Artists from './pages/Artists';

function Protected({ children }) {
  return localStorage.getItem('cinetrack_token') ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Protected><AppLayout /></Protected>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shots" element={<ShotTracker />} />
          <Route path="/shots/new" element={<AddShot />} />
          <Route path="/shots/:id" element={<ShotDetails />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/artists" element={<Artists />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
