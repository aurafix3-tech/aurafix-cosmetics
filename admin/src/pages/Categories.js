import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Filter, 
  X, 
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  MoreVertical,
  PlusCircle,
  Tag,
  ListTree,
  Folder,
  FolderOpen,
  Star,
  Menu,
  Grid,
  RefreshCw
} from 'lucide-react';

// Components
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryForm from '../components/categories/CategoryForm';
import EmptyCategories from '../components/categories/EmptyCategories';

// Styled Components
const Container = styled.div`
  padding: 1rem;
  max-width: 100%;
  overflow-x: hidden;
  min-height: 100vh;
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
    
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: normal;
      
      .divider {
        color: #d1d5db;
      }
      
      .back-btn {
        display: inline-flex;
        align-items: center;
        color: #4f46e5;
        cursor: pointer;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const SearchAndFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
  
  .search-wrapper {
    position: relative;
    flex: 1;
    max-width: 100%;
    
    @media (min-width: 640px) {
      max-width: 400px;
    }
    
    input {
      padding-left: 2.5rem;
      width: 100%;
      height: 44px;
      border-radius: 0.5rem;
      border: 1px solid #d1d5db;
      padding: 0.75rem 0.75rem 0.75rem 2.5rem;
      font-size: 0.875rem;
      
      @media (min-width: 640px) {
        height: 40px;
        padding: 0.5rem 0.75rem 0.5rem 2.5rem;
      }
      
      &:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 0 1px #4f46e5;
      }
    }
    
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      pointer-events: none;
    }
  }
  
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    width: 100%;
    
    @media (min-width: 640px) {
      width: auto;
    }
  }
`;

const CategoriesGrid = styled(motion.div).attrs(() => ({
  initial: 'hidden',
  animate: 'visible',
  variants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }
}))`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (min-width: 1536px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const MobileFloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: #4f46e5;
  color: white;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 40;
  
  @media (min-width: 640px) {
    display: none;
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  &:hover {
    background: #4338ca;
    transform: scale(1.05);
  }
`;

// Pagination and Filters
const Pagination = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .info {
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
    
    @media (min-width: 640px) {
      text-align: left;
    }
  }
  
  .pagination-controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    
    @media (min-width: 640px) {
      justify-content: flex-end;
    }
    
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
      background: white;
      color: #4b5563;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 44px;
      min-height: 44px;
      
      @media (min-width: 640px) {
        min-width: auto;
        min-height: auto;
      }
      
      &:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #d1d5db;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      &.active {
        background: #4f46e5;
        border-color: #4338ca;
        color: white;
      }
    }
  }
`;

// Main Component
const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for modals and forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'All Categories' }]);
  const [filters, setFilters] = useState({
    status: 'all',
    featured: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    search: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get current parent ID from URL or default to null (root)
  const parentId = searchParams.get('parent') || null;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  
  // Fetch categories with filters
  const { 
    data: categoriesData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery(
    ['categories', { parentId, page, limit, ...filters }],
    async () => {
      const params = new URLSearchParams({
        page,
        limit,
        ...(parentId && { parent: parentId }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.featured !== 'all' && { featured: filters.featured }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        ...(filters.search && { search: filters.search }),
      });
      
      const { data } = await axios.get(`/api/admin/categories?${params.toString()}`);
      return data;
    },
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        // Update breadcrumbs when parent changes
        if (parentId && data.parent) {
          const newBreadcrumbs = [
            { id: null, name: 'All Categories' },
            ...data.parent.ancestors.map(a => ({
              id: a._id,
              name: a.name,
            })),
            { id: data.parent._id, name: data.parent.name },
          ];
          setBreadcrumbs(newBreadcrumbs);
        } else if (!parentId) {
          setBreadcrumbs([{ id: null, name: 'All Categories' }]);
        }
      },
    }
  );
  
  // Mutations
  const deleteMutation = useMutation(
    (id) => axios.delete(`/api/admin/categories/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('Category deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      },
    }
  );
  
  const toggleStatusMutation = useMutation(
    ({ id, isActive }) => axios.patch(`/api/admin/categories/${id}/status`, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('Category status updated');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update category status');
      },
    }
  );
  
  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    setFilters(prev => ({ ...prev, search: searchValue }));
    setSearchParams(prev => {
      prev.set('page', '1');
      if (searchValue) {
        prev.set('search', searchValue);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };
  
  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBreadcrumbClick = (id) => {
    if (id === null) {
      setSearchParams({});
    } else {
      setSearchParams({ parent: id });
    }
  };
  
  const handleViewSubcategories = (category) => {
    setSearchParams({ parent: category._id });
  };
  
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };
  
  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(category._id);
    }
  };
  
  const handleToggleStatus = (category) => {
    toggleStatusMutation.mutate({ 
      id: category._id, 
      isActive: !category.isActive 
    });
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    refetch();
  };
  
  // Calculate pagination
  const totalPages = categoriesData?.pagination?.totalPages || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  if (isLoading && !categoriesData) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }
  
  if (isError) {
    return (
      <Container>
        <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
          Failed to load categories. Please try again.
          <button 
            onClick={() => refetch()}
            className="ml-2 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      {/* Header with Breadcrumbs */}
      <Header>
        <h1 className="title">
          <FolderOpen className="w-6 h-6 text-indigo-600" />
          <span>
            {parentId ? 'Subcategories' : 'Categories'}
            {categoriesData?.pagination?.totalCount !== undefined && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({categoriesData.pagination.totalCount} {categoriesData.pagination.totalCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </span>
          
          {breadcrumbs.length > 1 && (
            <div className="breadcrumb">
              <span className="divider">/</span>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.id || 'root'}>
                  {index > 0 && <span className="divider">/</span>}
                  <button 
                    onClick={() => handleBreadcrumbClick(item.id)}
                    className={`back-btn ${index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''}`}
                  >
                    {item.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </h1>
        
        <div className="hidden md:flex gap-2">
          <Button 
            variant="primary"
            onClick={() => {
              setSelectedCategory(null);
              setIsFormOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Category
          </Button>
        </div>
      </Header>
      
      {/* Search and Filters */}
      <SearchAndFilter>
        <form onSubmit={handleSearch} className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            name="search"
            placeholder="Search categories..."
            defaultValue={filters.search}
            className="search-input"
          />
          <button type="submit" className="sr-only">Search</button>
        </form>
        
        <div className="filters">
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="filter-group">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="createdAt">Sort by Date</option>
              <option value="productCount">Sort by Products</option>
            </select>
          </div>
          
          <div className="filter-group">
            <button
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
              }))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              title={filters.sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {filters.sortOrder === 'asc' ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="ml-auto"
            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </SearchAndFilter>
      
      {/* Categories Grid */}
      {categoriesData?.data?.length > 0 ? (
        <>
          <CategoriesGrid>
            <AnimatePresence>
              {categoriesData.data.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={{
                    ...category,
                    subcategoriesCount: category.subcategories?.length || 0
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewSubcategories={handleViewSubcategories}
                />
              ))}
            </AnimatePresence>
          </CategoriesGrid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <div className="info">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, categoriesData.pagination.totalCount)}
                </span>{' '}
                of <span className="font-medium">{categoriesData.pagination.totalCount}</span> categories
              </div>
              
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!hasPrevPage}
                  className="px-3 py-1 rounded"
                >
                  «
                </button>
                
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!hasPrevPage}
                  className="px-3 py-1 rounded"
                >
                  ‹
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show page numbers around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${page === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasNextPage}
                  className="px-3 py-1 rounded"
                >
                  ›
                </button>
                
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={!hasNextPage}
                  className="px-3 py-1 rounded"
                >
                  »
                </button>
              </div>
            </Pagination>
          )}
        </>
      ) : (
        <EmptyCategories 
          onAddCategory={() => setIsFormOpen(true)}
          isFiltered={filters.status !== 'all' || filters.search}
        />
      )}
      
      {/* Mobile Floating Action Button */}
      <MobileFloatingButton
        onClick={() => {
          setSelectedCategory(null);
          setIsFormOpen(true);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus />
      </MobileFloatingButton>
      
      {/* Add/Edit Category Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
        size="lg"
      >
        <CategoryForm
          category={selectedCategory}
          parentId={parentId}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedCategory(null);
          }}
        />
      </Modal>
    </Container>
  );
};

export default Categories;
