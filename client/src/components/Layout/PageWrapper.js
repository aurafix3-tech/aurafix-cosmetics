import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PageLoadingScreen from '../UI/PageLoadingScreen';
import usePageBackground from '../../hooks/usePageBackground';

const PageContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: ${props => props.position || 'cover'};
    object-position: center;
    transition: opacity 0.3s ease;
  }

  video {
    pointer-events: none;
  }

  /* Ensure background sticks and doesn't flicker */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    z-index: -1;
  }
`;

const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.color || '#000000'};
  opacity: ${props => props.opacity || 0.3};
  z-index: -1;
  pointer-events: none;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

const PageWrapper = ({ 
  children, 
  pageName, 
  showLoading = true, 
  loadingDuration = 2000,
  loadingText = "Loading..." 
}) => {
  const [isLoading, setIsLoading] = useState(showLoading);
  const [hasShownLoading, setHasShownLoading] = useState(false);
  const { background: pageBackground, imageLoaded: pageImageLoaded } = usePageBackground(pageName);
  const { background: loadingBackground } = usePageBackground('loading');

  useEffect(() => {
    // Only show loading screen once per session for each page
    const sessionKey = `loading_shown_${pageName}`;
    const hasShown = sessionStorage.getItem(sessionKey);
    
    if (showLoading && !hasShown) {
      setIsLoading(true);
      setHasShownLoading(true);
      sessionStorage.setItem(sessionKey, 'true');
    } else {
      setIsLoading(false);
    }
  }, [pageName, showLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <PageContainer>
      {/* Page Background */}
      {pageBackground && (
        <>
          <BackgroundContainer position={pageBackground.position}>
            {pageBackground.mediaType === 'video' ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${pageBackground.mediaUrl}`}
              />
            ) : (
              <img
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${pageBackground.mediaUrl}`}
                alt={pageBackground.alt || `${pageName} background`}
                style={{ 
                  opacity: pageImageLoaded ? 1 : 0,
                  transform: pageImageLoaded ? 'scale(1)' : 'scale(1.1)'
                }}
                onLoad={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            )}
          </BackgroundContainer>
          <BackgroundOverlay 
            color={pageBackground.overlayColor}
            opacity={pageBackground.overlayOpacity}
          />
        </>
      )}

      {/* Loading Screen */}
      <PageLoadingScreen
        isVisible={isLoading}
        onComplete={handleLoadingComplete}
        backgroundData={loadingBackground}
        loadingText={loadingText}
        duration={loadingBackground?.duration || loadingDuration}
      />

      {/* Page Content */}
      <ContentWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: isLoading ? 0 : 0.3 }}
      >
        {children}
      </ContentWrapper>
    </PageContainer>
  );
};

export default PageWrapper;
