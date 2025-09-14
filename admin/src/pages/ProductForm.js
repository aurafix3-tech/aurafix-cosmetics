import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDropzone } from 'react-dropzone';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  Save,
  Eye,
  Image as ImageIcon,
  Package
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }

  .back-button {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.3s ease;
    min-height: 44px;
    min-width: 44px;

    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 16px;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    font-size: 14px;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    font-size: 14px;

    @media (max-width: 768px) {
      padding: 14px 16px;
      font-size: 16px;
      min-height: 44px;
    }

    &:focus {
      border-color: #667eea;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const ImageUpload = styled.div`
  .dropzone {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f9fafb;

    &:hover, &.active {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .upload-icon {
      margin: 0 auto 16px;
      width: 48px;
      height: 48px;
      background: #e5e7eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .upload-text {
      color: #374151;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .upload-hint {
      color: #9ca3af;
      font-size: 14px;
    }
  }

  .image-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .image-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background: #f3f4f6;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-button {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover .remove-button {
      opacity: 1;
    }
  }
`;

const VariantsSection = styled.div`
  .variant-item {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;

    .variant-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h4 {
        font-weight: 600;
        color: #374151;
      }

      .remove-variant {
        background: none;
        border: none;
        color: #dc2626;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;

        &:hover {
          background: #fee2e2;
        }
      }
    }

    .variant-fields {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
  }

  .add-variant {
    background: none;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover {
      border-color: #667eea;
      color: #667eea;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  button {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &.secondary {
      background: white;
      color: #6b7280;
      border: 2px solid #e5e7eb;

      &:hover {
        border-color: #d1d5db;
        color: #374151;
      }
    }

    &.danger {
      background: #ef4444;
      color: white;

      &:hover:not(:disabled) {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }
`;

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  // Debug logging
  console.log('ProductForm - ID from useParams:', id, typeof id);
  console.log('ProductForm - isEdit:', isEdit);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    sku: '',
    stock: '',
    brand: '',
    category: '',
    subcategory: '',
    status: 'draft',
    featured: false,
    tags: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    seoTitle: '',
    seoDescription: '',
    variants: []
  });

  const [images, setImages] = useState([]);
  const [model3D, setModel3D] = useState(null);

  const { data: product, isLoading: productLoading } = useQuery(
    ['product', id],
    async () => {
      if (!id) return null;
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    },
    { enabled: isEdit }
  );

  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get('/api/categories');
    return response.data;
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        sku: product.sku || '',
        stock: product.stock || '',
        brand: product.brand || '',
        category: product.category?._id || '',
        subcategory: product.subcategory || '',
        status: product.status || 'draft',
        featured: product.featured || false,
        tags: product.tags?.join(', ') || '',
        weight: product.weight || '',
        dimensions: {
          length: product.dimensions?.length || '',
          width: product.dimensions?.width || '',
          height: product.dimensions?.height || ''
        },
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        variants: product.variants || []
      });
      setImages(product.images || []);
      setModel3D(product.model3D || null);
    }
  }, [product]);

  const saveProductMutation = useMutation(
    async (productData) => {
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(productData).forEach(key => {
        if (key === 'dimensions' || key === 'variants') {
          formDataToSend.append(key, JSON.stringify(productData[key]));
        } else if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(productData[key].split(',').map(tag => tag.trim()).filter(Boolean)));
        } else {
          formDataToSend.append(key, productData[key]);
        }
      });

      // Add images
      images.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append('images', image);
        }
      });

      // Add images to delete
      if (productData.imagesToDelete && productData.imagesToDelete.length > 0) {
        // Filter out any invalid entries and ensure proper serialization
        const validImagesToDelete = productData.imagesToDelete.filter(img => 
          img && typeof img === 'object' && img.url
        );
        console.log('Frontend - imagesToDelete before sending:', validImagesToDelete);
        if (validImagesToDelete.length > 0) {
          formDataToSend.append('imagesToDelete', JSON.stringify(validImagesToDelete));
        }
      }

      // Add remaining existing images
      const existingImages = images.filter(img => !(img instanceof File));
      if (existingImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      // Add 3D model
      if (model3D instanceof File) {
        formDataToSend.append('model3D', model3D);
      }

      if (isEdit) {
        return await axios.put(`/api/products/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        return await axios.post('/api/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/products');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
      }
    }
  );

  const deleteProductMutation = useMutation(
    async (productId) => {
      return await axios.delete(`/api/products/${productId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
        navigate('/products');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: (acceptedFiles) => {
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: '', value: '', price: '', stock: '' }
      ]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    
    // If it's an existing image (not a File), we need to track it for deletion
    if (!(imageToRemove instanceof File) && imageToRemove && typeof imageToRemove === 'object' && imageToRemove.url) {
      // Create a clean copy to avoid circular references
      const cleanImage = {
        url: imageToRemove.url,
        alt: imageToRemove.alt,
        isPrimary: imageToRemove.isPrimary,
        _id: imageToRemove._id
      };
      
      setFormData(prev => ({
        ...prev,
        imagesToDelete: [...(prev.imagesToDelete || []), cleanImage]
      }));
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProductMutation.mutate(formData);
  };

  if (productLoading) return <LoadingSpinner />;

  return (
    <FormContainer>
      <PageHeader>
        <button className="back-button" onClick={() => navigate('/products')}>
          <ArrowLeft size={20} />
        </button>
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <div>
            <FormCard>
              <h3>Product Information</h3>
              
              <FormGroup>
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="shortDescription">Short Description *</label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Brief product summary (max 200 characters)"
                  maxLength={200}
                  rows={3}
                />
                <small>{formData.shortDescription.length}/200 characters</small>
              </FormGroup>

              <FormGroup>
                <div className="form-row">
                  <div>
                    <label htmlFor="price">Price *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="comparePrice">Compare Price</label>
                    <input
                      type="number"
                      id="comparePrice"
                      name="comparePrice"
                      value={formData.comparePrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <div className="form-row">
                  <div>
                    <label htmlFor="sku">SKU</label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Enter SKU"
                    />
                  </div>
                  <div>
                    <label htmlFor="brand">Brand *</label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </FormGroup>
            </FormCard>

            <FormCard>
              <h3>Product Images</h3>
              <ImageUpload>
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  <div className="upload-icon">
                    <Upload size={20} />
                  </div>
                  <div className="upload-text">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                  </div>
                  <div className="upload-hint">or click to browse</div>
                </div>

                {images.length > 0 && (
                  <div className="image-preview">
                    {images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img 
                          src={image instanceof File ? URL.createObjectURL(image) : (typeof image === 'string' ? image : image?.url || '')} 
                          alt={`Product ${index + 1}`} 
                        />
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeImage(index)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUpload>
            </FormCard>

            <FormCard>
              <h3>Product Variants</h3>
              <VariantsSection>
                {formData.variants.map((variant, index) => (
                  <div key={index} className="variant-item">
                    <div className="variant-header">
                      <h4>Variant {index + 1}</h4>
                      <button
                        type="button"
                        className="remove-variant"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="variant-fields">
                      <div>
                        <label>Name</label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                          placeholder="e.g., Color"
                        />
                      </div>
                      <div>
                        <label>Value</label>
                        <input
                          type="text"
                          value={variant.value}
                          onChange={(e) => updateVariant(index, 'value', e.target.value)}
                          placeholder="e.g., Red"
                        />
                      </div>
                      <div>
                        <label>Price Modifier</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button type="button" className="add-variant" onClick={addVariant}>
                  <Plus size={16} />
                  Add Variant
                </button>
              </VariantsSection>
            </FormCard>
          </div>

          <div>
            <FormCard>
              <h3>Organization</h3>
              
              <FormGroup>
                <div className="form-row">
                  <div>
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      {categories?.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subcategory">Subcategory *</label>
                    <input
                      type="text"
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      placeholder="Enter subcategory"
                      required
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FormGroup>

              <FormGroup>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <label htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>
                    Featured Product
                  </label>
                </div>
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Featured products will be displayed on the home page
                </small>
              </FormGroup>

              <FormGroup>
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas"
                />
              </FormGroup>
            </FormCard>

            <FormCard>
              <h3>Shipping</h3>
              
              <FormGroup>
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  step="0.1"
                />
              </FormGroup>

              <FormGroup>
                <label>Dimensions (cm)</label>
                <div className="form-row">
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    placeholder="Length"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    placeholder="Width"
                  />
                </div>
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  placeholder="Height"
                  style={{ marginTop: '8px' }}
                />
              </FormGroup>
            </FormCard>

            <FormCard>
              <h3>SEO</h3>
              
              <FormGroup>
                <label htmlFor="seoTitle">SEO Title</label>
                <input
                  type="text"
                  id="seoTitle"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  placeholder="SEO title for search engines"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="seoDescription">SEO Description</label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  placeholder="SEO description for search engines"
                />
              </FormGroup>
            </FormCard>
          </div>
        </FormGrid>

        <ActionButtons>
          <button type="button" className="secondary" onClick={() => navigate('/products')}>
            Cancel
          </button>
          {isEdit && (
            <button 
              type="button" 
              className="danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                  deleteProductMutation.mutate(id);
                }
              }}
              disabled={deleteProductMutation.isLoading}
            >
              <Trash2 size={16} />
              {deleteProductMutation.isLoading ? 'Deleting...' : 'Delete Product'}
            </button>
          )}
          <button 
            type="submit" 
            className="primary"
            disabled={saveProductMutation.isLoading}
          >
            <Save size={16} />
            {saveProductMutation.isLoading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
        </ActionButtons>
      </form>
    </FormContainer>
  );
};

export default ProductForm;
