import React, { useState, useEffect } from 'react';
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

  img, video {
    width: 100%;
    height: 100%;
    object-fit: ${props => props.position || 'cover'};
    object-position: center;
  }

  video {
    pointer-events: none;
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
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: 2px;
  animation: ${pulse} 2s ease-in-out infinite;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
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
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;

  @media (max-width: 480px) {
    width: 250px;
  }
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f, #4d96ff);
  background-size: 200% 100%;
  animation: ${fadeIn} 0.5s ease-in;
`;

const SpinnerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Dot = styled(motion.div)`
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const PageLoadingScreen = ({ 
  isVisible, 
  onComplete, 
  backgroundData = null,
  loadingText = "Loading...",
  duration = 2000 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (duration / 50); // Update every 50ms
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete && onComplete();
          }, 300);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, duration, onComplete]);

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
          {backgroundData && (
            <BackgroundMedia position={backgroundData.position}>
              {backgroundData.mediaType === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${backgroundData.mediaUrl}`}
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${backgroundData.mediaUrl}`}
                  alt={backgroundData.alt || 'Loading background'}
                />
              )}
            </BackgroundMedia>
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
