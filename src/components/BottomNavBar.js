import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FaClock, FaCalendarAlt, FaChartBar, FaListAlt, FaPlus } from 'react-icons/fa';

const BottomNavBar = ({ activeTab, onTabChange, onCentralButtonClick }) => {
  return (
    <Navbar fixed="bottom" bg="light" variant="light" className="bottom-nav-bar">
      <Nav className="w-100 justify-content-around align-items-center">
        <Nav.Link onClick={() => onTabChange('timer')} active={activeTab === 'timer'}>
          <div className="nav-item-content">
            <FaClock size={20} /><span>Таймер</span>
          </div>
        </Nav.Link>
        <Nav.Link onClick={() => onTabChange('calendar')} active={activeTab === 'calendar'}>
          <div className="nav-item-content">
            <FaCalendarAlt size={20} /><span>Календарь</span>
          </div>
        </Nav.Link>
        <Button variant="primary" className="central-button" onClick={onCentralButtonClick}>
          <FaPlus size={24} />
        </Button>
        <Nav.Link onClick={() => onTabChange('history')} active={activeTab === 'history'}>
          <div className="nav-item-content">
            <FaListAlt size={20} /><span>История</span>
          </div>
        </Nav.Link>
        <Nav.Link onClick={() => onTabChange('charts')} active={activeTab === 'charts'}>
          <div className="nav-item-content">
            <FaChartBar size={20} /><span>Графики</span>
          </div>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default BottomNavBar;
