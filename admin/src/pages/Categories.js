import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  FolderTree,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    p {
      color: #6b7280;
    }
  }
`;

const ActionButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const SearchCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  align-items: center;

  .search-input {
    position: relative;
    flex: 1;

    input {
      width: 100%;
      padding: 10px 16px 10px 40px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #667eea;
      }
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }
  }
`;

const CategoriesGrid = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CategoriesTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f8fafc;
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #6b7280;
    font-size: 14px;
  }

  tr:hover {
    background: #f9fafb;
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .category-image {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      color: #9ca3af;
    }
  }

  .category-details {
    .category-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .category-slug {
      font-size: 12px;
      color: #9ca3af;
    }
  }
`;

const CategoryHierarchy = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 12px;

  .separator {
    color: #d1d5db;
  }
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;

  .menu-button {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.3s ease;

    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }

  .menu-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;
    min-width: 150px;
    overflow: hidden;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    color: #374151;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #f9fafb;
    }

    &.danger {
      color: #dc2626;

      &:hover {
        background: #fee2e2;
      }
    }
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
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
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

    &:focus {
      border-color: #667eea;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;

  button {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &.secondary {
      background: white;
      color: #374151;
      border: 2px solid #e5e7eb;

      &:hover {
        border-color: #d1d5db;
        background: #f9fafb;
      }
    }

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    image: null
  });

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery(
    ['categories', searchTerm],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/api/categories?${params}`);
      return response.data;
    }
  );

  const saveCategoryMutation = useMutation(
    async (categoryData) => {
      const formDataToSend = new FormData();
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== null && categoryData[key] !== '') {
          formDataToSend.append(key, categoryData[key]);
        }
      });

      if (editingCategory) {
        return await axios.put(`/api/categories/${editingCategory._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        return await axios.post('/api/categories', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      }
    }
  );

  const deleteCategoryMutation = useMutation(
    async (categoryId) => {
      await axios.delete(`/api/categories/${categoryId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('Category deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parent: '',
      image: null
    });
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent: category.parent?._id || '',
      image: null
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveCategoryMutation.mutate(formData);
  };

  const getCategoryPath = (category) => {
    const path = [];
    let current = category;
    
    while (current) {
      path.unshift(current.name);
      current = current.parent;
    }
    
    return path;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <CategoriesContainer>
      <PageHeader>
        <div className="header-left">
          <h1>Categories</h1>
          <p>Organize your products with categories</p>
        </div>
        <ActionButton
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={16} />
          Add Category
        </ActionButton>
      </PageHeader>

      <SearchCard>
        <div className="search-input">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </SearchCard>

      <CategoriesGrid>
        <CategoriesTable>
          <thead>
            <tr>
              <th>Category</th>
              <th>Hierarchy</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category._id}>
                <td>
                  <CategoryInfo>
                    <div className="category-image">
                      {category.image ? (
                        <img src={category.image} alt={category.name} />
                      ) : (
                        <FolderTree size={20} className="placeholder" />
                      )}
                    </div>
                    <div className="category-details">
                      <div className="category-name">{category.name}</div>
                      <div className="category-slug">/{category.slug}</div>
                    </div>
                  </CategoryInfo>
                </td>
                <td>
                  <CategoryHierarchy>
                    {getCategoryPath(category).map((name, index, array) => (
                      <React.Fragment key={index}>
                        {name}
                        {index < array.length - 1 && <span className="separator">→</span>}
                      </React.Fragment>
                    ))}
                  </CategoryHierarchy>
                </td>
                <td>{category.productCount || 0}</td>
                <td>
                  <ActionMenu>
                    <button
                      className="menu-button"
                      onClick={() => setOpenMenuId(openMenuId === category._id ? null : category._id)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenuId === category._id && (
                      <div className="menu-dropdown">
                        <button
                          className="menu-item"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          className="menu-item danger"
                          onClick={() => handleDelete(category._id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </ActionMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </CategoriesTable>
      </CategoriesGrid>

      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="parent">Parent Category</label>
                <select
                  id="parent"
                  value={formData.parent}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent: e.target.value }))}
                >
                  <option value="">No Parent (Root Category)</option>
                  {categories?.filter(cat => cat._id !== editingCategory?._id).map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="image">Category Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                />
              </FormGroup>

              <ModalActions>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary"
                  disabled={saveCategoryMutation.isLoading}
                >
                  {saveCategoryMutation.isLoading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </CategoriesContainer>
  );
};

export default Categories;
