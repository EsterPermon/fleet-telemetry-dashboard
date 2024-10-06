import { Provider } from 'react-redux';
import { store } from './store';
import './i18n';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import NotificationsCenter from './pages/notificationsCenter';
import VehicleDetails from './pages/vehicleDetails';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} /> {/* //!NOTE: Make Dashboard the default route */}
            <Route path="notifications" element={<NotificationsCenter />} />
            <Route path="vehicle/:vehicleId" element={<VehicleDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Provider>
    </Router>
  );
}

export default App;
