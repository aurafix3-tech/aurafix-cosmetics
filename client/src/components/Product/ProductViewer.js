import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  X,
  Heart,
  Share2
} from 'lucide-react';

const ViewerContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '400px'};
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    rgba(147, 197, 253, 0.05) 50%, 
    rgba(219, 234, 254, 0.05) 100%);
  position: relative;
  border: 1px solid rgba(59, 130, 246, 0.1);
`;

const MainImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: ${props => props.zoomable ? 'zoom-in' : 'default'};
`;

const MainImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  transform-origin: center;
  transition: transform 0.3s ease;
  transform: scale(${props => props.scale || 1}) 
             translateX(${props => props.translateX || 0}px) 
             translateY(${props => props.translateY || 0}px);
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  gap: 10px;
`;

const ImageNavigation = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ViewerContainer}:hover & {
    opacity: 1;
  }
`;

const NavButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #3b82f6;
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Controls = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 4;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ViewerContainer}:hover & {
    opacity: 1;
  }
`;

const ControlButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

const ThumbnailContainer = styled.div`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 4;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ViewerContainer}:hover & {
    opacity: 1;
  }
`;

const Thumbnail = styled(motion.img)`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
  }
`;

const ThumbnailPlaceholder = styled.div`
  width: 50px;
  height: 50px;
  background: #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 10px;
  text-align: center;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
`;

const FullscreenModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FullscreenContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const FullscreenControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const FullscreenButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: white;
  }
`;

const ImageIndicator = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  z-index: 4;
`;

const ColorSwatches = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 4;
`;

const ColorSwatch = styled(motion.div)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.8)'};
  background: ${props => props.color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ProductViewer = ({ 
  product, 
  height = '400px',
  showControls = true,
  showThumbnails = true,
  showColorSwatches = false,
  objectFit = 'cover',
  colors = []
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedColor, setSelectedColor] = useState(colors[0] || null);

  // Get product images
  const getImages = () => {
    if (!product?.images || product.images.length === 0) {
      return [];
    }
    
    return product.images.map(image => {
      if (typeof image === 'object' && image.url) {
        return image.url;
      }
      if (typeof image === 'string') {
        return image;
      }
      return null;
    }).filter(Boolean);
  };

  const images = getImages();
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      resetZoom();
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      resetZoom();
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 1));
  };

  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    resetZoom();
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleShare = async () => {
    if (navigator.share && currentImage) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'Escape':
            setIsFullscreen(false);
            break;
          case '+':
          case '=':
            zoomIn();
            break;
          case '-':
            zoomOut();
            break;
          case '0':
            resetZoom();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  return (
    <>
      <ViewerContainer height={height} zoomable={scale === 1}>
        <MainImageContainer onClick={scale === 1 ? zoomIn : undefined}>
          {currentImage && !imageErrors[currentImageIndex] ? (
            <MainImage
              src={currentImage}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              scale={scale}
              translateX={translateX}
              translateY={translateY}
              objectFit={objectFit}
              onError={() => handleImageError(currentImageIndex)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <PlaceholderImage>
              <div>{product?.name || 'Product'}</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                No image available
              </div>
            </PlaceholderImage>
          )}
        </MainImageContainer>

        {images.length > 1 && (
          <ImageNavigation>
            <NavButton
              onClick={prevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={20} />
            </NavButton>
            <NavButton
              onClick={nextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={20} />
            </NavButton>
          </ImageNavigation>
        )}

        {showControls && (
          <Controls>
            <ControlButton
              onClick={zoomIn}
              disabled={scale >= 3}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </ControlButton>
            <ControlButton
              onClick={zoomOut}
              disabled={scale <= 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </ControlButton>
            <ControlButton
              onClick={resetZoom}
              disabled={scale === 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Reset Zoom"
            >
              <RotateCcw size={16} />
            </ControlButton>
            <ControlButton
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Fullscreen"
            >
              <Maximize2 size={16} />
            </ControlButton>
            <ControlButton
              onClick={handleShare}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Share"
            >
              <Share2 size={16} />
            </ControlButton>
          </Controls>
        )}

        {showColorSwatches && colors.length > 0 && (
          <ColorSwatches>
            {colors.map((color, index) => (
              <ColorSwatch
                key={index}
                color={color.hex || color}
                active={selectedColor === color}
                onClick={() => setSelectedColor(color)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={color.name || `Color ${index + 1}`}
              />
            ))}
          </ColorSwatches>
        )}

        {showThumbnails && images.length > 1 && (
          <ThumbnailContainer>
            {images.map((image, index) => (
              imageErrors[index] ? (
                <ThumbnailPlaceholder
                  key={index}
                  active={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  {index + 1}
                </ThumbnailPlaceholder>
              ) : (
                <Thumbnail
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  active={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={() => handleImageError(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              )
            ))}
          </ThumbnailContainer>
        )}

        {images.length > 1 && (
          <ImageIndicator>
            {currentImageIndex + 1} / {images.length}
          </ImageIndicator>
        )}
      </ViewerContainer>

      <AnimatePresence>
        {isFullscreen && currentImage && (
          <FullscreenModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleFullscreen}
          >
            <FullscreenContent onClick={(e) => e.stopPropagation()}>
              <FullscreenImage
                src={currentImage}
                alt={`${product.name} - Fullscreen`}
              />
              
              <FullscreenControls>
                <FullscreenButton
                  onClick={toggleFullscreen}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </FullscreenButton>
              </FullscreenControls>
            </FullscreenContent>
          </FullscreenModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductViewer;
