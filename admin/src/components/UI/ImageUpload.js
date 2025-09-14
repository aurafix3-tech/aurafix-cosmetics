import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const UploadWrapper = styled.div`
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

const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fafafa;
  
  &:hover {
    border-color: #4f46e5;
    background-color: #f8faff;
  }
  
  ${props => props.isDragOver && `
    border-color: #4f46e5;
    background-color: #f0f7ff;
  `}
  
  ${props => props.error && `
    border-color: #dc2626;
    background-color: #fef2f2;
  `}
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  
  .upload-icon {
    color: #9ca3af;
  }
  
  .upload-text {
    color: #374151;
    font-weight: 500;
  }
  
  .upload-subtext {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewItem = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ImageUpload = ({
  label,
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  value = null,
  onChange,
  error,
  required = false,
  ...props
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        return false;
      }
      return file.type.startsWith('image/');
    });

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9)
      }));

      if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews]);
        onChange([...previews.map(p => p.file), ...validFiles]);
      } else {
        setPreviews(newPreviews);
        onChange(validFiles[0]);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  const removePreview = (id) => {
    const newPreviews = previews.filter(p => p.id !== id);
    setPreviews(newPreviews);
    
    if (multiple) {
      onChange(newPreviews.map(p => p.file));
    } else {
      onChange(null);
    }
  };

  return (
    <UploadWrapper>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      
      <UploadArea
        isDragOver={isDragOver}
        error={error}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <UploadContent>
          <Upload size={32} className="upload-icon" />
          <div className="upload-text">
            Click to upload or drag and drop
          </div>
          <div className="upload-subtext">
            PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
          </div>
        </UploadContent>
      </UploadArea>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        {...props}
      />

      {previews.length > 0 && (
        <PreviewContainer>
          {previews.map((preview) => (
            <PreviewItem key={preview.id}>
              <img src={preview.url} alt="Preview" />
              <RemoveButton onClick={() => removePreview(preview.id)}>
                <X size={12} />
              </RemoveButton>
            </PreviewItem>
          ))}
        </PreviewContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </UploadWrapper>
  );
};

export default ImageUpload;
