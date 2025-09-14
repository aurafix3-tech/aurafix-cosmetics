import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Image as ImageIcon, ChevronDown } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import ImageUpload from '../UI/ImageUpload';

const CategoryForm = ({ category, onCancel, onSuccess, parentId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    parent: category?.parent || parentId || '',
    isActive: category?.isActive ?? true,
    isFeatured: category?.isFeatured || false,
    image: null
  });
  
  const [parentCategories, setParentCategories] = useState([]);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  
  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        setIsLoadingParents(true);
        const response = await axios.get('/api/admin/categories');
        setParentCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
        toast.error('Failed to load parent categories');
      } finally {
        setIsLoadingParents(false);
      }
    };

    fetchParentCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      let response;
      if (category) {
        response = await axios.put(`/api/admin/categories/${category._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('/api/admin/categories', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(`Category ${category ? 'updated' : 'created'} successfully`);
      onSuccess && onSuccess(response.data);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || `Failed to ${category ? 'update' : 'create'} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Category Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Enter category name"
        />

        <Input
          label="Description"
          name="description"
          as="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter category description"
        />

        <Input
          label="Parent Category"
          name="parent"
          as="select"
          value={formData.parent}
          onChange={handleInputChange}
        >
          <option value="">No Parent (Root Category)</option>
          {parentCategories.filter(cat => cat._id !== category?._id).map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </Input>

        <ImageUpload
          label="Category Image"
          value={formData.image}
          onChange={(file) => setFormData(prev => ({ ...prev, image: file }))}
          accept="image/*"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="mr-2"
            />
            Active
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="mr-2"
            />
            Featured
          </label>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          fullWidth
        >
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
