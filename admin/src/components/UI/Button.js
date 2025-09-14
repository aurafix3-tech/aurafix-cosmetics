import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Primary variant */
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }
  `}
  
  /* Secondary variant */
  ${props => props.variant === 'secondary' && `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover:not(:disabled) {
      border-color: #d1d5db;
      background: #f9fafb;
    }
  `}
  
  /* Danger variant */
  ${props => props.variant === 'danger' && `
    background: #dc2626;
    color: white;
    
    &:hover:not(:disabled) {
      background: #b91c1c;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
    }
  `}
  
  /* Ghost variant */
  ${props => props.variant === 'ghost' && `
    background: transparent;
    color: #6b7280;
    
    &:hover:not(:disabled) {
      background: #f3f4f6;
      color: #374151;
    }
  `}
  
  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  `}
  
  ${props => props.size === 'lg' && `
    padding: 1rem 2rem;
    font-size: 1rem;
  `}
  
  /* Full width */
  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid currentColor',
              borderTop: '2px solid transparent',
              borderRadius: '50%'
            }}
          />
          Loading...
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;
