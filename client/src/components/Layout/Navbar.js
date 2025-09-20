import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  Heart,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;
    height: 70px;
    max-width: 100%;
  }
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  letter-spacing: -1px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #667eea;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  padding: 8px 40px 8px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  outline: none;
  width: 250px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
  color: #333;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  padding: 0;
  display: none;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLink = styled(motion(Link))`
  display: block;
  padding: 20px 24px;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  transition: all 0.3s ease;
  background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.05) 0%);
  background-size: 0% 100%;
  background-repeat: no-repeat;

  &:hover {
    color: #667eea;
    background-size: 100% 100%;
    padding-left: 32px;
  }

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleY(1);
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 8px;
  min-width: 200px;
  z-index: 1001;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #333;

  &:hover {
    background: #f8f9fa;
  }
`;

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getCartCount } = useCartStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">Aurafixx</Logo>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </NavLinks>

        <NavActions>
          <SearchContainer>
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">
                <Search size={18} />
              </SearchButton>
            </form>
          </SearchContainer>

          <IconButton onClick={() => navigate('/cart')}>
            <ShoppingBag size={20} />
            {getCartCount() > 0 && (
              <CartBadge>{getCartCount()}</CartBadge>
            )}
          </IconButton>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <IconButton onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                <User size={20} />
              </IconButton>
              
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <UserDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem onClick={() => {
                      navigate('/profile');
                      setIsUserDropdownOpen(false);
                    }}>
                      <User size={16} />
                      Profile
                    </DropdownItem>
                    <DropdownItem onClick={() => {
                      navigate('/profile?tab=wishlist');
                      setIsUserDropdownOpen(false);
                    }}>
                      <Heart size={16} />
                      Wishlist
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </DropdownItem>
                  </UserDropdown>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <IconButton onClick={() => navigate('/login')}>
              <User size={20} />
            </IconButton>
          )}

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </NavActions>
      </NavContent>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
              staggerChildren: 0.1
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <MobileNavLink 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🏠 Home
              </MobileNavLink>
              <MobileNavLink 
                to="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                💄 Products
              </MobileNavLink>
              <MobileNavLink 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ℹ️ About
              </MobileNavLink>
              <MobileNavLink 
                to="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📞 Contact
              </MobileNavLink>
              {!isAuthenticated && (
                <>
                  <MobileNavLink 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🔐 Login
                  </MobileNavLink>
                  <MobileNavLink 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📝 Register
                  </MobileNavLink>
                </>
              )}
            </motion.div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;
