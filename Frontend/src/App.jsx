import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
//import Dashboard from './pages/Dashboard';
import Dashboard from './Supervisor/pages/Dashboard';
import { UserProvider } from './context/UserContext';


function App() {
  // console.log(UserProvider);
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
