import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Sparkles,
  Image
} from 'lucide-react';

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.collapsed ? '80px' : '280px'};
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  z-index: 1000;
  transition: width 0.3s ease;
  overflow: hidden;

  @media (max-width: 768px) {
    width: ${props => props.collapsed ? '0' : '280px'};
    transform: translateX(${props => props.collapsed ? '-100%' : '0'});
    box-shadow: ${props => props.collapsed ? 'none' : '2px 0 10px rgba(0,0,0,0.3)'};
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: white;

  .icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: opacity 0.3s ease;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.3s ease;
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Navigation = styled.nav`
  padding: 24px 0;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  color: ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  min-height: 48px;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #667eea;
    transform: scaleY(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }

  .icon {
    flex-shrink: 0;
  }

  .text {
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: 16px 24px;
    min-height: 52px;
  }
`;

const Sidebar = ({ collapsed, isMobile, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/categories', icon: FolderTree, label: 'Categories' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/backgrounds', icon: Image, label: 'Page Backgrounds' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <SidebarContainer
      collapsed={collapsed}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SidebarHeader>
        <Logo collapsed={collapsed}>
          <div className="icon">
            <Sparkles size={18} />
          </div>
          <span className="text">AuraFixx Admin</span>
        </Logo>
        <ToggleButton onClick={onToggle}>
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </ToggleButton>
      </SidebarHeader>

      <Navigation>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavItem
              key={item.path}
              to={item.path}
              active={isActive}
              collapsed={collapsed}
              onClick={() => {
                // Close sidebar on mobile after navigation
                if (isMobile) {
                  onToggle();
                }
              }}
            >
              <Icon size={20} className="icon" />
              <span className="text">{item.label}</span>
            </NavItem>
          );
        })}
      </Navigation>
    </SidebarContainer>
  );
};

export default Sidebar;
