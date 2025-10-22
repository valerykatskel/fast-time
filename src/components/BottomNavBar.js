import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FaClock, FaCalendarAlt, FaChartBar, FaPlus } from 'react-icons/fa';

const BottomNavBar = ({ activeTab, onTabChange, onCentralButtonClick }) => {
  return (
    <Navbar fixed="bottom" bg="light" variant="light" className="bottom-nav-bar">
      <Nav className="w-100 justify-content-around align-items-center">
        <Nav.Link onClick={() => onTabChange('timer')} active={activeTab === 'timer'}>
          <FaClock size={20} /><br/>Таймер
        </Nav.Link>
        <Nav.Link onClick={() => onTabChange('history')} active={activeTab === 'history'}>
          <FaCalendarAlt size={20} /><br/>История
        </Nav.Link>
        <Button variant="primary" className="central-button" onClick={onCentralButtonClick}>
          <FaPlus size={24} />
        </Button>
        <Nav.Link onClick={() => onTabChange('charts')} active={activeTab === 'charts'}>
          <FaChartBar size={20} /><br/>Графики
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default BottomNavBar;
