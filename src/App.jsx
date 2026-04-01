import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

// import Home from './pages/Home';
// import About from './pages/About';
// import ContactUs from './pages/ContactUs';

// auth
import Register from './pages/Onboarding';
import Login from './pages/Login';
// import Forgotpassword from './pages/Forgotpassword';
// import One from './components/kyc/One';
// import ResetPassword from './pages/ResetPassword';

// // dashboard
import Userdashboard from './pages/Userdashboard';
// import VerifyEmail from './pages/VerifyEmail';
// import UserHistory from './pages/UserHistory';
// import Userprofile from './pages/Userprofile';
// import UserFundAcct from './pages/UserFundAcct';
// import UserPaytax from './pages/UserPaytax';
// import UserNotification from './pages/UserNotification';
// import UserPayVerify from './pages/UserPayVerify';
// import UserTaxVerify from './pages/UserTaxVerify';
// import UserQrCode from './pages/UserQrCode';


// // admin dashboard
// import UserAdmin from './pages/UserAdmin';
// import AdminKyc from './pages/AdminKyc';
// import AdminPayment from './pages/AdminPayments';

// // other
import ScrollToTop from './pages/ScrooltoTop';
import NotFound from './components/404/NotFound'
// import TestDashboard from './pages/TestDashboard';
// import UserSettings from './pages/UserSettings';
// import AdminUsers from './pages/AdminUsers';
// import AdminManageStatesadmins from './pages/AdminManageStatesadmins';
// import AdminRevenueByStates from './pages/AdminRevenueByStates';
// import AdminStatesDAshboard from './pages/AdminStatesDAshboard';
// import AdminRevenueDetails from './pages/AdminRevenueDetails';
// import ScanQrcode from './components/qrcode/ScanQrcode';
// // import useSimpleAutoLogout from './pages/UseSimpleAutoLogout';

function App() {


  // useEffect(() => {
  //   AOS.init({
  //     offset: 60,
  //     duration: 500,
  //     easing: 'ease-in-sine',
  //     delay: 100,
  //   })
  //   AOS.refresh()
  //   // duration=1200;
  // }, [])

  // useSimpleAutoLogout(3)


  const route = 'https://abctelemed.onrender.com'
  // const route = 'http://localhost:5000'


  return (
    <>
      <div className="App">
        <Router>
          <ScrollToTop />
          <Routes>
            {/* <Route path='/' element={<Home route={route} />} /> */}
            <Route path='/' element={<Login route={route} />} />
            {/* <Route path='/about' element={<About />} />
            <Route path='/contact' element={<ContactUs />} /> */}

            {/* auth */}
            <Route path='/login' element={<Login route={route} />} />
            <Route path='/auth-signup' element={<Register route={route} />} />
            <Route path='/ref_register/:ref' element={<Register route={route} />} />
            {/* <Route path='/auth/acctrecovery' element={<Forgotpassword route={route} />} />
            <Route path='/auth/reset-password/:token' element={<ResetPassword route={route} />} /> */}

            {/* dashboard */}
            <Route path='/dashboard' element={<Userdashboard />} />
            {/*<Route path='/payment_history' element={<UserHistory route={route} />} />
            <Route path='/settings' element={<UserSettings route={route} />} />
            <Route path='/myprofile' element={<Userprofile route={route} />} />
            <Route path='/verify-email/:token' element={<VerifyEmail route={route} />} />
            <Route path='/fundwallet' element={<UserFundAcct route={route} />} />
            <Route path='/paytaxes' element={<UserPaytax route={route} />} />
            <Route path='/user/kyc' element={<One route={route} />} />
            <Route path='/user/notification' element={<UserNotification route={route} />} />
            <Route path='/payment/verify' element={<UserPayVerify route={route} />} />
            <Route path='/tax/verify' element={<UserTaxVerify route={route} />} />
            <Route path="/download-qr" element={<UserQrCode route={route} />} />
            <Route path="/verify-tax/:taxId" element={<ScanQrcode route={route} />} /> */}

            {/* admin */}
            {/* <Route path='/myadmin' element={<UserAdmin route={route} />} />
            <Route path='/admin/user-management' element={<AdminUsers route={route} />} />
            <Route path='/admin/kyc-management' element={<AdminKyc route={route} />} />
            <Route path='/admin/deposits' element={<AdminPayment route={route} />} />
            <Route path='/admin/state-admin' element={<AdminStatesDAshboard route={route} />} />
            <Route path='/admin/manage-admin' element={<AdminManageStatesadmins route={route} />} />
            <Route path='/admin/Revenuebystate' element={<AdminRevenueByStates route={route} />} />
            <Route path='/admin/revenue/state/:stateName' element={<AdminRevenueDetails route={route} />} />

            <Route path='/testme/deposits' element={<TestDashboard route={route} />} /> */}


            <Route path="*" element={<NotFound />} />

          </Routes>
        </Router>
      </div>


    </>
  )
}

export default App
