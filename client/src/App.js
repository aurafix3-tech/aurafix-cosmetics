import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import PageWrapper from './components/Layout/PageWrapper';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Pages
import Home from './pages/HomeSimple';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Store
import { useAuthStore } from './store/authStore';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed navbar */
  width: 100%;
  
  @media (max-width: 768px) {
    padding-top: 70px;
    padding-left: 0;
    padding-right: 0;
  }
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AppContainer>
      <GlobalStyles />
      <Navbar />
      <MainContent>
        <ErrorBoundary>
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
                    <Home />
                  </motion.div>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <PageWrapper pageName="products" loadingText="Loading Products">
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Products />
                    </motion.div>
                  </PageWrapper>
                } 
              />
              <Route 
                path="/products/:id" 
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <ProductDetail />
                  </motion.div>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Cart />
                  </motion.div>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Checkout />
                  </motion.div>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Profile />
                  </motion.div>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Login />
                  </motion.div>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Register />
                  </motion.div>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PageWrapper pageName="about" loadingText="About AuraFix">
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <About />
                    </motion.div>
                  </PageWrapper>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <PageWrapper pageName="contact" loadingText="Get in Touch">
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Contact />
                    </motion.div>
                  </PageWrapper>
                } 
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
        </ErrorBoundary>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
