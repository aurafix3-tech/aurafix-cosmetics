import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(102, 126, 234, 0.4); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BackgroundMedia = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: ${props => props.position || 'cover'};
    object-position: center;
    transition: all 0.3s ease;
  }

  video {
    pointer-events: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 2s ease-in-out infinite;
    z-index: 2;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.color || '#000000'};
  opacity: ${props => props.opacity || 0.3};
  z-index: 2;
`;

const LoadingContent = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  color: white;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  letter-spacing: 3px;
  background: linear-gradient(45deg, #fff, #667eea, #764ba2, #fff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${pulse} 2s ease-in-out infinite, ${glow} 3s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  position: relative;

  &::after {
    content: 'AuraFix';
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
    letter-spacing: 2px;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
    letter-spacing: 1px;
  }
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProgressBar = styled.div`
  width: 350px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1.5rem;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 1.5s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    width: 280px;
  }
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
  background-size: 200% 100%;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    border-radius: 10px;
    animation: ${shimmer} 1s ease-in-out infinite;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Dot = styled(motion.div)`
  width: 14px;
  height: 14px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.8), 0 0 30px rgba(102, 126, 234, 0.4);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
  }
`;

const ImagePreloader = styled.img`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
`;

const PageLoadingScreen = ({ 
  isVisible, 
  onComplete, 
  backgroundData = null,
  loadingText = "Loading...",
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const imageRef = useRef(null);

  // Preload background image
  useEffect(() => {
    if (backgroundData && backgroundData.mediaType === 'image') {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setMediaError(true);
      img.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${backgroundData.mediaUrl}`;
    } else {
      setImageLoaded(true);
    }
  }, [backgroundData]);

  useEffect(() => {
    if (!isVisible) return;

    // Wait for image to load before starting progress
    const startProgress = () => {
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (duration / 30); // Update every 30ms for smoother animation
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete && onComplete();
            }, 500);
            return 100;
          }
          
          return newProgress;
        });
      }, 30);
      return interval;
    };

    let interval;
    if (imageLoaded || mediaError) {
      interval = startProgress();
    } else {
      // Wait for image to load
      const checkImage = setInterval(() => {
        if (imageLoaded || mediaError) {
          clearInterval(checkImage);
          interval = startProgress();
        }
      }, 100);
      return () => clearInterval(checkImage);
    }

    return () => interval && clearInterval(interval);
  }, [isVisible, duration, onComplete, imageLoaded, mediaError]);

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <LoadingContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {backgroundData && !mediaError && (
            <BackgroundMedia position={backgroundData.position}>
              {backgroundData.mediaType === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setMediaError(true)}
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${backgroundData.mediaUrl}`}
                />
              ) : (
                <img
                  ref={imageRef}
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${backgroundData.mediaUrl}`}
                  alt={backgroundData.alt || 'Loading background'}
                  onError={() => setMediaError(true)}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
              )}
            </BackgroundMedia>
          )}
          
          {/* Fallback gradient background */}
          {(!backgroundData || mediaError) && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
              backgroundSize: '400% 400%',
              animation: `${gradientShift} 8s ease infinite`,
              zIndex: 1
            }} />
          )}
          
          <Overlay 
            color={backgroundData?.overlayColor} 
            opacity={backgroundData?.overlayOpacity} 
          />
          
          <LoadingContent>
            <Logo>AuraFix</Logo>
            <LoadingText>{loadingText}</LoadingText>
            
            <ProgressBar>
              <Progress
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </ProgressBar>
            
            <SpinnerContainer>
              {[0, 1, 2].map((index) => (
                <Dot
                  key={index}
                  variants={dotVariants}
                  initial="initial"
                  animate="animate"
                  transition={{
                    ...dotTransition,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </SpinnerContainer>
          </LoadingContent>
        </LoadingContainer>
      )}
    </AnimatePresence>
  );
};

export default PageLoadingScreen;
