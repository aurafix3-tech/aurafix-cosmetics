import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUpload, FiEdit, FiTrash2, FiEye, FiEyeOff, FiPlay, FiImage } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const Description = styled.p`
  color: #718096;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const MediaPreview = styled.div`
  position: relative;
  height: 200px;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    color: #a0aec0;
    font-size: 3rem;
  }
`;

const MediaOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.color || '#000000'};
  opacity: ${props => props.opacity || 0.3};
  pointer-events: none;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const PageName = styled.h3`
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-transform: capitalize;
`;

const MediaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  .icon {
    font-size: 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #4299e1;
    color: white;
    
    &:hover {
      background: #3182ce;
    }
  }

  &.secondary {
    background: #edf2f7;
    color: #4a5568;
    
    &:hover {
      background: #e2e8f0;
    }
  }

  &.danger {
    background: #fed7d7;
    color: #c53030;
    
    &:hover {
      background: #feb2b2;
    }
  }

  &.success {
    background: #c6f6d5;
    color: #2f855a;
    
    &:hover {
      background: #9ae6b4;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled(motion.div)`
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
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2d3748;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const FileUpload = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 6px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4299e1;
    background: #f7fafc;
  }

  &.dragover {
    border-color: #4299e1;
    background: #ebf8ff;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  &.active {
    background: #c6f6d5;
    color: #2f855a;
  }

  &.inactive {
    background: #fed7d7;
    color: #c53030;
  }
`;

const PageBackgrounds = () => {
  const { token } = useAuthStore();
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBackground, setEditingBackground] = useState(null);
  const [formData, setFormData] = useState({
    pageName: 'home',
    mediaType: 'image',
    alt: '',
    overlayOpacity: 0.3,
    overlayColor: '#000000',
    position: 'cover',
    duration: 2000,
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const pageOptions = [
    { value: 'home', label: 'Home Page' },
    { value: 'products', label: 'Products Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'about', label: 'About Page' },
    { value: 'loading', label: 'Loading Screen' }
  ];

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/backgrounds`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setBackgrounds(data.data);
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Auto-detect media type
    if (file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, mediaType: 'video' }));
    } else {
      setFormData(prev => ({ ...prev, mediaType: 'image' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitFormData = new FormData();
    Object.keys(formData).forEach(key => {
      submitFormData.append(key, formData[key]);
    });
    
    if (selectedFile) {
      submitFormData.append('media', selectedFile);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/backgrounds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitFormData,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        fetchBackgrounds();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message || 'Error saving background');
      }
    } catch (error) {
      console.error('Error saving background:', error);
      alert('Error saving background');
    }
  };

  const handleDelete = async (pageName) => {
    if (!window.confirm('Are you sure you want to delete this background?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/backgrounds/${pageName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        fetchBackgrounds();
      } else {
        alert(data.message || 'Error deleting background');
      }
    } catch (error) {
      console.error('Error deleting background:', error);
      alert('Error deleting background');
    }
  };

  const handleToggleActive = async (pageName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/backgrounds/${pageName}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        fetchBackgrounds();
      } else {
        alert(data.message || 'Error toggling background status');
      }
    } catch (error) {
      console.error('Error toggling background status:', error);
      alert('Error toggling background status');
    }
  };

  const resetForm = () => {
    setFormData({
      pageName: 'home',
      mediaType: 'image',
      alt: '',
      overlayOpacity: 0.3,
      overlayColor: '#000000',
      position: 'cover',
      duration: 2000,
      isActive: true
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingBackground(null);
  };

  const openEditModal = (background) => {
    setEditingBackground(background);
    setFormData({
      pageName: background.pageName,
      mediaType: background.mediaType,
      alt: background.alt,
      overlayOpacity: background.overlayOpacity,
      overlayColor: background.overlayColor,
      position: background.position,
      duration: background.duration,
      isActive: background.isActive
    });
    setPreviewUrl(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${background.mediaUrl}`);
    setShowModal(true);
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>Page Backgrounds</Title>
          <Description>
            Manage background images and videos for different pages and loading screens
          </Description>
        </div>
        <Button 
          className="primary"
          onClick={() => setShowModal(true)}
        >
          <FiUpload /> Add Background
        </Button>
      </Header>

      <Grid>
        {pageOptions.map(page => {
          const background = backgrounds.find(bg => bg.pageName === page.value);
          
          return (
            <Card key={page.value}>
              <MediaPreview>
                {background ? (
                  <>
                    {background.mediaType === 'video' ? (
                      <video
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${background.mediaUrl}`}
                        muted
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${background.mediaUrl}`}
                        alt={background.alt}
                      />
                    )}
                    <MediaOverlay 
                      color={background.overlayColor}
                      opacity={background.overlayOpacity}
                    />
                  </>
                ) : (
                  <div className="placeholder">
                    <FiImage />
                  </div>
                )}
              </MediaPreview>
              
              <CardContent>
                <PageName>{page.label}</PageName>
                
                {background && (
                  <MediaInfo>
                    {background.mediaType === 'video' ? <FiPlay className="icon" /> : <FiImage className="icon" />}
                    <span>{background.mediaType}</span>
                    <StatusBadge className={background.isActive ? 'active' : 'inactive'}>
                      {background.isActive ? <FiEye /> : <FiEyeOff />}
                      {background.isActive ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </MediaInfo>
                )}
                
                <Actions>
                  {background ? (
                    <>
                      <Button 
                        className="secondary"
                        onClick={() => openEditModal(background)}
                      >
                        <FiEdit /> Edit
                      </Button>
                      <Button 
                        className={background.isActive ? 'secondary' : 'success'}
                        onClick={() => handleToggleActive(background.pageName)}
                      >
                        {background.isActive ? <FiEyeOff /> : <FiEye />}
                        {background.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button 
                        className="danger"
                        onClick={() => handleDelete(background.pageName)}
                      >
                        <FiTrash2 /> Delete
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="primary"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, pageName: page.value }));
                        setShowModal(true);
                      }}
                    >
                      <FiUpload /> Add Background
                    </Button>
                  )}
                </Actions>
              </CardContent>
            </Card>
          );
        })}
      </Grid>

      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent>
            <h2>{editingBackground ? 'Edit Background' : 'Add Background'}</h2>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Page</Label>
                <Select
                  value={formData.pageName}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageName: e.target.value }))}
                  disabled={editingBackground}
                >
                  {pageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Media File</Label>
                <FileUpload
                  onClick={() => document.getElementById('file-input').click()}
                >
                  {previewUrl ? (
                    <div>
                      {formData.mediaType === 'video' ? (
                        <video src={previewUrl} style={{ maxHeight: '200px', maxWidth: '100%' }} controls />
                      ) : (
                        <img src={previewUrl} style={{ maxHeight: '200px', maxWidth: '100%' }} alt="Preview" />
                      )}
                      <p>Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <FiUpload size={48} />
                      <p>Click to upload image or video</p>
                      <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                        Supports: JPEG, PNG, WebP, GIF, MP4, WebM, MOV
                      </p>
                    </div>
                  )}
                </FileUpload>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                />
              </FormGroup>

              <FormGroup>
                <Label>Alt Text</Label>
                <Input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Descriptive text for accessibility"
                />
              </FormGroup>

              <FormGroup>
                <Label>Position</Label>
                <Select
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Overlay Color</Label>
                <Input
                  type="color"
                  value={formData.overlayColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlayColor: e.target.value }))}
                />
              </FormGroup>

              <FormGroup>
                <Label>Overlay Opacity ({formData.overlayOpacity})</Label>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.overlayOpacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                />
              </FormGroup>

              {formData.pageName === 'loading' && (
                <FormGroup>
                  <Label>Loading Duration (ms)</Label>
                  <Input
                    type="number"
                    min="1000"
                    max="10000"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  />
                </FormGroup>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button 
                  type="button" 
                  className="secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="primary">
                  {editingBackground ? 'Update' : 'Create'} Background
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default PageBackgrounds;
