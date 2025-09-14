import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';

// Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Users from './pages/Users';
import PageBackgrounds from './pages/PageBackgrounds';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Store
import { useAuthStore } from './store/authStore';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '280px'};
  transition: margin-left 0.3s ease;
  min-width: 0; /* Prevent content overflow */

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-width: 0; /* Prevent content overflow */

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

function App() {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // Redirect non-admin users
  if (isAuthenticated && user?.role !== 'admin') {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AppContainer>
      <GlobalStyles />
      <Sidebar 
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <Header 
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <ContentArea>
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Dashboard />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/products" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Products />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/products/new" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductForm />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/products/:id/edit" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductForm />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/categories" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Categories />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Orders />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <OrderDetail />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Users />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/backgrounds" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <PageBackgrounds />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Analytics />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Settings />
                    </motion.div>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
}

export default App;
