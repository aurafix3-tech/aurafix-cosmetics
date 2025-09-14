import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: ${props => props.maxWidth || '500px'};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin: 1rem;
  
  @media (max-width: 640px) {
    margin: 0.5rem;
    max-height: 95vh;
    border-radius: 0.5rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0 1rem;
  
  @media (min-width: 640px) {
    padding: 1.5rem 1.5rem 0 1.5rem;
  }
  
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    
    @media (min-width: 640px) {
      font-size: 1.25rem;
    }
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth,
  closeOnOverlayClick = true,
  showCloseButton = true,
  ...props 
}) => {
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          {...props}
        >
          <ModalContent
            maxWidth={maxWidth}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <ModalHeader>
                {title && <h2>{title}</h2>}
                {showCloseButton && (
                  <CloseButton onClick={() => typeof onClose === 'function' && onClose()}>
                    <X size={16} />
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            <ModalBody>
              {children}
            </ModalBody>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
