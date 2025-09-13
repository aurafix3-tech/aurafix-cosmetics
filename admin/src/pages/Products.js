import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex: 1;

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

  .header-actions {
    display: flex;
    gap: 12px;
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

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }

  &.secondary {
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;

    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
  }
`;

const FiltersCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

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
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #667eea;
  }
`;

const ProductsGrid = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProductsTable = styled.table`
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

const ProductImage = styled.div`
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
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .product-details {
    .product-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .product-sku {
      font-size: 12px;
      color: #9ca3af;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &.active {
    background: #dcfce7;
    color: #166534;
  }

  &.inactive {
    background: #fee2e2;
    color: #991b1b;
  }

  &.draft {
    background: #fef3c7;
    color: #92400e;
  }
`;

const StockBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;

  &.in-stock {
    background: #dcfce7;
    color: #166534;
  }

  &.low-stock {
    background: #fef3c7;
    color: #92400e;
  }

  &.out-of-stock {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const FeaturedToggle = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.featured {
    color: #f59e0b;
    background: #fef3c7;

    &:hover {
      background: #fde68a;
    }
  }

  &.not-featured {
    color: #9ca3af;
    background: #f9fafb;

    &:hover {
      background: #f3f4f6;
      color: #6b7280;
    }
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

const Pagination = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #e5e7eb;

  .pagination-info {
    color: #6b7280;
    font-size: 14px;
  }

  .pagination-controls {
    display: flex;
    gap: 8px;
  }

  .pagination-button {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      border-color: #667eea;
      color: #667eea;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
  }
`;

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useQuery(
    ['products', { page: currentPage, search: searchTerm, category: categoryFilter, status: statusFilter }],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter })
      });
      
      const response = await axios.get(`/api/products?${params}`);
      return response.data;
    }
  );

  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get('/api/categories');
    return response.data;
  });

  const deleteProductMutation = useMutation(
    async (productId) => {
      await axios.delete(`/api/products/${productId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  );

  const toggleFeaturedMutation = useMutation(
    async ({ productId, featured }) => {
      await axios.patch(`/api/products/${productId}`, { featured });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update product');
      }
    }
  );

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleToggleFeatured = (productId, currentFeatured) => {
    toggleFeaturedMutation.mutate({
      productId,
      featured: !currentFeatured
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  };

  const getStockLabel = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  if (isLoading) return <LoadingSpinner />;

  const products = productsData?.products || [];
  const totalPages = Math.ceil((productsData?.total || 0) / 10);

  return (
    <ProductsContainer>
      <PageHeader>
        <div className="header-left">
          <h1>Products</h1>
          <p>Manage your product catalog</p>
        </div>
        <div className="header-actions">
          <ActionButton className="secondary">
            <Filter size={16} />
            Export
          </ActionButton>
          <ActionButton
            as={Link}
            to="/products/new"
            className="primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            Add Product
          </ActionButton>
        </div>
      </PageHeader>

      <FiltersCard>
        <SearchInput>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories?.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </FilterSelect>
      </FiltersCard>

      <ProductsGrid>
        <ProductsTable>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <ProductInfo>
                    <ProductImage>
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <Package size={20} className="placeholder" />
                      )}
                    </ProductImage>
                    <div className="product-details">
                      <div className="product-name">{product.name}</div>
                      <div className="product-sku">SKU: {product.sku}</div>
                    </div>
                  </ProductInfo>
                </td>
                <td>{product.category?.name || 'Uncategorized'}</td>
                <td>${product.price}</td>
                <td>
                  <StockBadge className={getStockStatus(product.stock)}>
                    {getStockLabel(product.stock)} ({product.stock})
                  </StockBadge>
                </td>
                <td>
                  <StatusBadge className={product.status}>
                    {product.status === 'active' && <CheckCircle size={12} />}
                    {product.status === 'inactive' && <XCircle size={12} />}
                    {product.status === 'draft' && <AlertCircle size={12} />}
                    {product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Unknown'}
                  </StatusBadge>
                </td>
                <td>
                  <FeaturedToggle
                    className={product.isFeatured ? 'featured' : 'not-featured'}
                    onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                    title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                  >
                    <Star size={16} fill={product.isFeatured ? 'currentColor' : 'none'} />
                  </FeaturedToggle>
                </td>
                <td>
                  <ActionMenu>
                    <button
                      className="menu-button"
                      onClick={() => setOpenMenuId(openMenuId === String(product._id) ? null : String(product._id))}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenuId === String(product._id) && (
                      <div className="menu-dropdown">
                        <Link to={`/products/${String(product._id)}`} className="menu-item">
                          <Eye size={14} />
                          View
                        </Link>
                        <Link to={`/products/${String(product._id)}/edit`} className="menu-item">
                          <Edit size={14} />
                          Edit
                        </Link>
                        <button
                          className="menu-item danger"
                          onClick={() => handleDelete(String(product._id))}
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
        </ProductsTable>

        <Pagination>
          <div className="pagination-info">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, productsData?.total || 0)} of {productsData?.total || 0} products
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </Pagination>
      </ProductsGrid>
    </ProductsContainer>
  );
};

export default Products;
