import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Dashboard from './Supervisor/pages/Dashboard';
// import ManagerLayout from './Manager/pages/ManagerLayout';
import { UserProvider } from './context/UserContext';
// import ProfilePage from './Supervisor/components/dashboard/ProfilePage';
import Dashboard from './page/Dashboard';
import ProfilePage from './page/ProfilePage';
import Login from './page/Login'
import { Settings } from 'lucide-react';
import Setting from './page/Settings';
import ForgotPassword from './components/ForgotPassword';
import Admin from './page/admin/AdminDasboard';



function App() {
  // console.log(UserProvider);
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ManagerLayout/>} />
          <Route path="/profile" element={<ProfilePage />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;