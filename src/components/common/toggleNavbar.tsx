import React, { useState } from 'react';
import Navbar from './navbar';

const ToggleNavbar: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleNavClick = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <div data-testid="toggle-navbar">
      <Navbar
        isNavbarOpen={isNavbarOpen}
        handleNavClick={handleNavClick}
      />
    </div>
  );
};

export default ToggleNavbar;