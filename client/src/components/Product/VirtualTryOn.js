import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Download, Share2, RotateCcw, Palette, X } from 'lucide-react';

const TryOnButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TryOnModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const TryOnContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: #3b82f6;
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 350px;
  background: #f8fafc;
  border-radius: 15px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 13px;
`;

const UploadPrompt = styled.div`
  text-align: center;
  color: #64748b;
  
  h3 {
    margin-bottom: 10px;
    color: #1e293b;
  }
  
  p {
    margin-bottom: 20px;
    font-size: 14px;
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }
  
  input {
    display: none;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const ColorSwatch = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  background: ${props => props.color};
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::after {
    content: '${props => props.name}';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #64748b;
    white-space: nowrap;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  padding: 10px 20px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
  }
  
  &.primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border-color: transparent;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ResultOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .makeup-overlay {
    position: absolute;
    background: ${props => props.color};
    opacity: 0.6;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .lips {
    width: 60px;
    height: 20px;
    bottom: 35%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 30px;
  }
  
  .cheeks-left {
    width: 40px;
    height: 40px;
    top: 45%;
    left: 25%;
  }
  
  .cheeks-right {
    width: 40px;
    height: 40px;
    top: 45%;
    right: 25%;
  }
  
  .eyes-left {
    width: 30px;
    height: 15px;
    top: 35%;
    left: 35%;
    border-radius: 15px;
  }
  
  .eyes-right {
    width: 30px;
    height: 15px;
    top: 35%;
    right: 35%;
    border-radius: 15px;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
`;

const VirtualTryOn = ({ product, productType = 'lipstick' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Product colors based on type
  const productColors = {
    lipstick: [
      { name: 'Rose Pink', color: '#ff69b4' },
      { name: 'Classic Red', color: '#dc143c' },
      { name: 'Coral', color: '#ff7f50' },
      { name: 'Berry', color: '#8b008b' },
      { name: 'Nude', color: '#deb887' }
    ],
    foundation: [
      { name: 'Fair', color: '#fdbcb4' },
      { name: 'Light', color: '#edb98a' },
      { name: 'Medium', color: '#c68642' },
      { name: 'Tan', color: '#a0522d' },
      { name: 'Deep', color: '#8d5524' }
    ],
    eyeshadow: [
      { name: 'Gold', color: '#ffd700' },
      { name: 'Purple', color: '#6a0dad' },
      { name: 'Blue', color: '#4169e1' },
      { name: 'Green', color: '#50c878' },
      { name: 'Bronze', color: '#cd7f32' }
    ],
    blush: [
      { name: 'Pink', color: '#ffb6c1' },
      { name: 'Peach', color: '#ffcba4' },
      { name: 'Rose', color: '#ff91a4' },
      { name: 'Coral', color: '#ff7f7f' },
      { name: 'Berry', color: '#de3163' }
    ]
  };

  const currentColors = productColors[productType] || productColors.lipstick;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowResult(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const startTryOn = () => {
    setIsActive(true);
  };

  const closeTryOn = () => {
    setIsActive(false);
    setSelectedImage(null);
    setShowResult(false);
  };

  const captureResult = () => {
    // In a real implementation, this would capture the current result
    if (selectedImage) {
      const link = document.createElement('a');
      link.download = `aurafixx-virtual-tryOn-${product.name}.png`;
      link.href = selectedImage; // In reality, this would be the processed image
      link.click();
    }
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Virtual Try-On: ${product.name}`,
          text: `Check out how I look with ${product.name} from Aurafixx!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  const resetTryOn = () => {
    setSelectedImage(null);
    setShowResult(false);
    setSelectedColor(0);
  };

  const getMakeupOverlays = () => {
    const color = currentColors[selectedColor]?.color;
    
    switch (productType) {
      case 'lipstick':
        return [
          <div key="lips" className="makeup-overlay lips" />
        ];
      case 'blush':
        return [
          <div key="cheek-left" className="makeup-overlay cheeks-left" />,
          <div key="cheek-right" className="makeup-overlay cheeks-right" />
        ];
      case 'eyeshadow':
        return [
          <div key="eye-left" className="makeup-overlay eyes-left" />,
          <div key="eye-right" className="makeup-overlay eyes-right" />
        ];
      case 'foundation':
        return [
          <div key="face" className="makeup-overlay" style={{
            width: '80%',
            height: '90%',
            top: '5%',
            left: '10%',
            borderRadius: '50%',
            opacity: 0.3
          }} />
        ];
      default:
        return [
          <div key="lips" className="makeup-overlay lips" />
        ];
    }
  };

  return (
    <>
      <TryOnButton
        onClick={startTryOn}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading && <LoadingSpinner />}
        <Camera size={18} />
        {isLoading ? 'Processing...' : 'Virtual Try-On'}
      </TryOnButton>

      <AnimatePresence>
        {isActive && (
          <TryOnModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeTryOn()}
          >
            <TryOnContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <CloseButton onClick={closeTryOn}>
                <X size={24} />
              </CloseButton>
              
              <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>
                Virtual Try-On: {product.name}
              </h2>
              
              <p style={{ color: '#64748b', marginBottom: '20px' }}>
                Upload your photo to see how this {productType} looks on you
              </p>
              
              <PreviewContainer>
                {selectedImage ? (
                  <>
                    <PreviewImage src={selectedImage} alt="Your photo" />
                    {showResult && (
                      <ResultOverlay color={currentColors[selectedColor]?.color}>
                        {getMakeupOverlays()}
                      </ResultOverlay>
                    )}
                  </>
                ) : (
                  <UploadPrompt>
                    <h3>Upload Your Photo</h3>
                    <p>Choose a clear, well-lit photo facing the camera</p>
                    <UploadButton>
                      <Camera size={18} />
                      Choose Photo
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </UploadButton>
                  </UploadPrompt>
                )}
              </PreviewContainer>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>
                  Choose Color:
                </h4>
                <ColorPalette>
                  {currentColors.map((colorOption, index) => (
                    <ColorSwatch
                      key={index}
                      color={colorOption.color}
                      name={colorOption.name}
                      active={selectedColor === index}
                      onClick={() => setSelectedColor(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </ColorPalette>
              </div>
              
              <ActionButtons>
                {selectedImage && (
                  <>
                    <ActionButton
                      onClick={captureResult}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download size={16} />
                      Save Result
                    </ActionButton>
                    
                    <ActionButton
                      onClick={shareResult}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 size={16} />
                      Share
                    </ActionButton>
                    
                    <ActionButton
                      onClick={resetTryOn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw size={16} />
                      Try Again
                    </ActionButton>
                  </>
                )}
                
                <ActionButton
                  className="primary"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera size={16} />
                  {selectedImage ? 'Change Photo' : 'Upload Photo'}
                </ActionButton>
              </ActionButtons>
              
              <p style={{ 
                fontSize: '12px', 
                color: '#94a3b8', 
                marginTop: '20px',
                lineHeight: '1.4'
              }}>
                This is a preview simulation. Results may vary based on lighting, 
                skin tone, and photo quality. For best results, use a clear, 
                front-facing photo with good lighting.
              </p>
            </TryOnContent>
          </TryOnModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default VirtualTryOn;
