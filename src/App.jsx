import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Register from './pages/Onboarding';
import Login from './pages/Login';
import ForgotPassword from './pages/Forgotpassword';
import ResetPassword from './pages/Resetpassword';
import Userdashboard from './pages/Userdashboard';
import ScrollToTop from './pages/ScrooltoTop';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Home    from './pages/Home';
import Privacy from './pages/Privacy';


import NotFound from './components/404/NotFound'

function App() {
  // const route = 'https://abctelemed.onrender.com
  const route = 'https://abctelemed-production.up.railway.app'
  // const route = 'http://localhost:3000'

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path='/'        element={<Home />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/login' element={<Login route={route} />} />
          <Route path='/auth-signup' element={<Register route={route} />} />
          <Route path='/ref_register/:ref' element={<Register route={route} />} />
          <Route path='/auth/acctrecovery' element={<ForgotPassword route={route} />} />
          <Route path='/auth/reset-password/:token' element={<ResetPassword route={route} />} />
          <Route path='/dashboard' element={<Userdashboard route={route} />} />
          <Route path='/admin/login' element={<AdminLogin route={route} />} />
          <Route path='/myadmin' element={<AdminDashboard route={route} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App