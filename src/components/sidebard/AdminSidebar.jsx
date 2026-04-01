import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaListAlt, 
  FaChartLine,
  FaArrowAltCircleLeft,
  FaMoneyBillWave,
  FaCog,
  FaNewspaper
} from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa6';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    
    const logout = ()=>{
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="bigsidemenu admin-sidebar">
            <div className='toplogo'>
                <img src="/logo.png" alt="selfstorage.ng" className="desklogo" />
                <img src="/favicon.png" alt="selfstorage.ng" className="mobilelogo" />
            </div>

            <div className='menucontainer admin-nav'>
                <span className="subcontainer">
                    <h2>Admin Panel</h2>
                    
                    <button 
                        className={activeTab === 'overview' ? 'active' : ''} 
                        onClick={() => setActiveTab('overview')}
                    >
                        <FaChartLine /> Overview
                    </button>
                    
                    <button 
                        className={activeTab === 'payments' ? 'active' : ''} 
                        onClick={() => setActiveTab('payments')}
                    >
                        <FaMoneyBillWave /> Payments
                    </button>
                    
                    <button 
                        className={activeTab === 'listings' ? 'active' : ''} 
                        onClick={() => setActiveTab('listings')}
                    >
                        <FaListAlt /> Listings
                    </button>
                    
                    <button 
                        className={activeTab === 'users' ? 'active' : ''} 
                        onClick={() => setActiveTab('users')}
                    >
                        <FaUsers /> Users
                    </button>
                    
                    <button 
                        className={activeTab === 'news' ? 'active' : ''} 
                        onClick={() => setActiveTab('news')}
                    >
                        <FaNewspaper /> News/Blog
                    </button>
                    
                    <button 
                        className={activeTab === 'settings' ? 'active' : ''} 
                        onClick={() => setActiveTab('settings')}
                    >
                        <FaCog /> add account
                    </button>
                </span>

                <button className="logout-btn" onClick={() => logout()}>
                    ← Back to Dashboard
                </button>
            </div>

            
                        
            <div className="mobcontainer">
                <span className="smcontainer">
                    <h2>
                        <FaUserTie className='mobh2icon'/>
                    </h2>
                    
                    <button 
                        className={activeTab === 'overview' ? 'active' : ''} 
                        onClick={() => setActiveTab('overview')}
                        title="Overview"
                    >
                        <FaChartLine className='mobh2icon'/>
                    </button>
                    
                    <button 
                        className={activeTab === 'payments' ? 'active' : ''} 
                        onClick={() => setActiveTab('payments')}
                        title="Payments"
                    >
                        <FaMoneyBillWave className='mobh2icon'/>
                    </button>
                    
                    <button 
                        className={activeTab === 'listings' ? 'active' : ''} 
                        onClick={() => setActiveTab('listings')}
                        title="Listings"
                    >
                        <FaListAlt className='mobh2icon'/>
                    </button>
                    
                    <button 
                        className={activeTab === 'users' ? 'active' : ''} 
                        onClick={() => setActiveTab('users')}
                        title="Users"
                    >
                        <FaUsers className='mobh2icon'/> 
                    </button>
                    
                    <button 
                        className={activeTab === 'news' ? 'active' : ''} 
                        onClick={() => setActiveTab('news')}
                        title="News/Blog"
                    >
                        <FaNewspaper className='mobh2icon'/> 
                    </button>
                    
                    <button 
                        className={activeTab === 'settings' ? 'active' : ''} 
                        onClick={() => setActiveTab('settings')}
                        title="Settings"
                    >
                        <FaCog className='mobh2icon'/> 
                    </button>
                    
                    <button 
                        onClick={() => logout()}
                        title="Back to Dashboard"
                    >
                        <FaArrowAltCircleLeft className='mobh2icon'/> 
                    </button>
                </span>
            </div>

        </div>
    );
};

export default AdminSidebar;