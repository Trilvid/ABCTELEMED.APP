import React, { useState } from 'react';
import Userdashboardhomepage from '../components/userdashboardhomepage/Userdashboardhomepage';
import Sidebar from '../components/sidebard/Sidebar';
import SiderbadHead from '../components/sidebard/SiderbadHead';

const Userdashboard = ({ route }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const handleSelectSection = (section) => {
        setActiveSection(section);
        setIsMobileNavOpen(false);
    };

    return (
        <div className="newdashboard">
            <div className={`newsidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}>
                <Sidebar
                    activeSection={activeSection}
                    onSelectSection={handleSelectSection}
                    onClose={() => setIsMobileNavOpen(false)}
                />
            </div>

            <div className="main-panel">
                <SiderbadHead
                    onOpenMenu={() => setIsMobileNavOpen(true)}
                    activeSection={activeSection}
                />
                <Userdashboardhomepage
                    activeSection={activeSection}
                    onSelectSection={handleSelectSection}
                    route={route}
                />
            </div>

            {isMobileNavOpen && (
                <button
                    type="button"
                    className="doctor-sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={() => setIsMobileNavOpen(false)}
                />
            )}
        </div>
    );
};

export default Userdashboard;
