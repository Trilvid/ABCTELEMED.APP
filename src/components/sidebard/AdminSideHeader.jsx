import React, {useState,useEffect} from 'react'
import { AiOutlineClose, AiOutlineStock } from 'react-icons/ai'
import { FiLogOut } from 'react-icons/fi'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { HiOutlineMenu, HiOutlineMenuAlt2 } from 'react-icons/hi';
import { TbNotification } from 'react-icons/tb';
import { BiChevronDown, BiUser } from 'react-icons/bi';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { 
  FaUsers, 
  FaListAlt, 
  FaChartLine,
  FaCog,
  FaNewspaper
} from 'react-icons/fa';
import { FaMoneyBillWave } from 'react-icons/fa6';

const AdminSideHeader = ({ route, activeTab, setActiveTab }) => {
    const navigate = useNavigate()
    const [dropDown,setDropDown] = useState(false)
    const [userData, setUserData] = useState()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenu, setIsMobileMenu] = useState(false)


    const logout = ()=>{
        localStorage.removeItem('atoken')
        navigate('/login')
    }
    useEffect(()=>{
        if(localStorage.getItem('atoken')){
            const getData = async()=>{
                const req = await fetch(`${route}/api/users/getdata`,{
                    headers: {
                    'x-access-token': localStorage.getItem('atoken')
                    }
                })
                const res = await req.json()
                setUserData(res)
            }
            
            getData()
        }
        else{
            navigate('/login')
        }
          
    },[])  

        useEffect(() => {
      const sidebar = document.querySelector('.newsidebar');
      const mainPanel = document.querySelector('.main-panel');
      const sidelogo = document.querySelector('.desklogo');
      const sideicon = document.querySelector('.mobilelogo');

      const bignavicon = document.querySelector('.menucontainer');
      const smnavicon = document.querySelector('.mobcontainer');
    
      if (sidebar && mainPanel) {
        if (isSidebarCollapsed) {
          sidebar.style.width = '8%';
          mainPanel.style.width = '92%';
          sidelogo.style.display = 'none'
          sideicon.style.display = 'flex'
          bignavicon.style.display = 'none'
          smnavicon.style.display = 'flex'
        } else {
          sidebar.style.width = '20%';
          mainPanel.style.width = '80%';
          sidelogo.style.display = 'flex'
          sideicon.style.display = 'none'
          bignavicon.style.display = 'flex'
          smnavicon.style.display = 'none'
        }
      }
    }, [isSidebarCollapsed]);
    
          

  return (
    <>
            {
                dropDown &&
                <div className="sidebar_drop_down" onBlur={()=>{
                    setDropDown(false)
                }}>

                    <div className="dropdown-tabs" onClick={()=>{
                       setDropDown(false)
                    }}>
                        <AiOutlineClose className='tbicon'/>
                        <p>close</p>
                    </div>

                    <div className="dropdown-header">
                        <span className="profile-pic-container">
                            {userData && userData.profilepicture !== '' ? <img src={userData.profilepicture} alt="" /> : userData.firstname.charAt(0)} 
                        </span>
                        <span className="dropdown-user-details">
                            <p className='dropdown-name'>
                                {userData ? userData.name : ''}
                                </p>
                            <p className='dropdown-email'>{userData ? userData.email : 'johndeo@gmail.com'}</p>
                        </span>

                    </div>
                    
                    <div className="dropdown-tabs" onClick={()=>{
                       logout()
                    }}>
                        <FiLogOut className='tbicon'/>
                        <p>logout</p>
                    </div>
                    
                </div>
            }

        <div className='userheader'>
            <span className='smmenu'>
                <HiOutlineMenu 
                    className='desktogleicon'
                    onClick={() => setIsSidebarCollapsed(prev => !prev)}
                />

                <div className="mobtogleicon">
                    <HiOutlineMenuAlt2 
                        className='mbticon'
                        onClick={()=>{
                        setIsMobileMenu(true)
                        }}
                    />
                </div>

            </span>

            <span className='bigmenu'>
                <div className='notify'>
                    <RiCustomerService2Fill className='picon'/>
                    <TbNotification className='picon'/>
                    {/* <p>verified</p> */}
                </div>

                <div className="header-profile-container" onClick={()=>{
                    setDropDown(true)
                }}>
                    <span className="user-icon-wrapper">
                        <BiUser />
                    </span>
                    <p>{userData ? userData.firstname : ''}</p>
                    <span className="arrow-container">
                        <BiChevronDown />
                    </span>
                </div>
            </span>
            
            {
                isMobileMenu && 
                <div className="thismenumodalformobile">
                
            <div className='menucontainer admin-nav'>
                <div className='thismodalclosebtn' onClick={()=>{
                    setIsMobileMenu(false)
                }}>
                <AiOutlineClose className='tbicon'/> &nbsp;
                <p>close</p>
                </div>
                <div className="smximg">
                    <img src="/logo.png" alt="selfstorageNG" className="fgggfd" />
                </div> 
            
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

                
                </div>
            }
                    
        </div>
    </>
  )
}

export default AdminSideHeader