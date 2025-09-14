import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: #dc2626;
    }
  `}
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  outline: none;
  
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  ${props => props.error && `
    border-color: #dc2626;
    
    &:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  `}
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  outline: none;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  ${props => props.error && `
    border-color: #dc2626;
    
    &:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  `}
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  outline: none;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  ${props => props.error && `
    border-color: #dc2626;
    
    &:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  `}
`;

const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
`;

const HelpText = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
`;

const Input = ({ 
  label,
  type = 'text',
  error,
  helpText,
  required = false,
  as = 'input',
  children,
  ...props 
}) => {
  const Component = as === 'textarea' ? StyledTextarea : as === 'select' ? StyledSelect : StyledInput;
  
  return (
    <InputWrapper>
      {label && (
        <Label required={required} htmlFor={props.id}>
          {label}
        </Label>
      )}
      <Component
        type={as === 'input' ? type : undefined}
        error={error}
        required={required}
        {...props}
      >
        {children}
      </Component>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helpText && !error && <HelpText>{helpText}</HelpText>}
    </InputWrapper>
  );
};

export default Input;
