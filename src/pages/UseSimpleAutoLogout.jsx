// ✅ SIMPLE AUTO-LOGOUT - No warning, just direct logout after 5 min

import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useSimpleAutoLogout = (timeoutMinutes = 5) => {
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    const INACTIVITY_TIME = timeoutMinutes * 60 * 1000; // Convert to milliseconds

    // Logout function
    const logout = useCallback(() => {
        // Clear timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Save current page
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/auth-signup') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
        }

        // Clear user data
        localStorage.removeItem('token');
        localStorage.removeItem('atoken');
        localStorage.removeItem('satoken');
        localStorage.removeItem('user');

        // Redirect to login
        navigate('/', {
            state: { message: 'Session expired due to inactivity' }
        });
    }, [navigate]);

    // Reset timer
    const resetTimer = useCallback(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            logout();
        }, INACTIVITY_TIME);
    }, [logout, INACTIVITY_TIME]);

    // Handle activity
    const handleActivity = useCallback(() => {
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token') || localStorage.getItem('atoken') || localStorage.getItem('satoken');
        if (!token) return;

        // Events to track
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        // Add listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        // Start timer
        resetTimer();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [handleActivity, resetTimer]);

    return { logout, resetTimer };
};

export default useSimpleAutoLogout;

// ==========================================
// USAGE:
// ==========================================
// In App.js:
// import useSimpleAutoLogout from './hooks/useSimpleAutoLogout';
//
// function App() {
//   useSimpleAutoLogout(5); // 5 minutes (or any number)
//   return <Routes>...</Routes>
// }
// ==========================================