import React, { useRef } from 'react'
import './header.css'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineMenuAlt2 } from "react-icons/hi";



const Header = () => {
    const [showModal, setShowModal] = useState(false)
    const [bgColor, setBgColor] = useState(false)
    const [bgLogo, setBgLogo] = useState('/logo.svg')

    // 1. Create a function to handle the scrolling
    const scrollToSection = (sectionId) => {

        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const changeOnScroll = () => {
        if (window.scrollY >= 90) {
            setBgColor(true)
            setBgLogo('/logo.svg')
        }
        else {
            setBgColor(false)
            setBgLogo('/logo.svg')
        }
    }
    window.addEventListener('scroll', changeOnScroll)
    const navigate = useNavigate()
    return (
        <motion.header className={`${bgColor && 'scroll-color'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65 }}
        >
            <div className="logo-container">
                <img src={bgLogo} alt="" className='logo' onClick={() => {
                    navigate('/')
                }} />
            </div>
            <nav id='home'>
                <ul>
                    <li onClick={() => scrollToSection('home-section')}>
                        <Link to="/">home</Link>
                        <span className='line'></span>
                    </li>
                    <li onClick={() => scrollToSection('why-section')}>
                        <Link to="#">about us</Link>
                        <span className='line'></span>
                    </li>

                    <li onClick={() => scrollToSection('faqs-section')}>
                        <Link to="/#">contact us</Link>
                        <span className='line'></span>
                    </li>
                    <li>
                        <Link to="/policy"> </Link>
                        <span className='line'></span>
                    </li>
                    <li>
                        <Link to="/contact"></Link>
                        <span className='line'></span>
                    </li>

                </ul>
                <div className="sign-up-btn-container">
                    {/* <button className='signup-btn' onClick={()=>{navigate('/auth-signup')}}>Get started</button> */}
                    <button className='signup-btnx' onClick={() => { navigate('/auth-signup') }}>Get started</button>
                </div>
            </nav>

            <div class="mobile-menu-container" onClick={() => {
                setShowModal(!showModal)
            }}>
                <HiOutlineMenuAlt2 className='spanxIcon' />
            </div>
            <div className={`menu-modal ${showModal ? 'showing-modal' : ''}`}>
                <ul>
                    <Link to='/' onClick={() => scrollToSection('home-section')}>home</Link>
                    <Link to='/#' onClick={() => scrollToSection('why-section')}>About us</Link>
                    <Link to='/#' onClick={() => scrollToSection('faqs-section')}>contact us</Link>
                    {/* <Link to='/policy'></Link>
                <Link to='/contact'></Link> */}
                    <Link to='/auth-signup'><button className='signup-btn'>Get started</button></Link>
                    <Link to='/login'><button className='signup-btnx'>login</button></Link>
                    {/* <Link to='/auth-signup'>Get started</Link>
                <Link to='/login'>login</Link> */}
                </ul>
            </div>
        </motion.header>
    )
}

export default Header