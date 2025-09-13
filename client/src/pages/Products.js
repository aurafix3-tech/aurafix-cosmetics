import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  Filter, 
  Grid, 
  List, 
  Search, 
  Star, 
  Heart,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Product3DViewer from '../components/3D/Product3DViewer';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 12px 40px 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  outline: none;
  width: 300px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
`;

const ViewButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const FiltersPanel = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const FilterGroup = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterChip = styled.button`
  padding: 8px 16px;
  background: ${props => props.$active ? '#667eea' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#e9ecef'};
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  input {
    width: 80px;
    padding: 8px 12px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    outline: none;

    &:focus {
      border-color: #667eea;
    }
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => 
    props.view === 'grid' 
      ? 'repeat(auto-fill, minmax(300px, 1fr))' 
      : '1fr'
  };
  gap: 32px;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: ${props => props.view === 'list' ? 'flex' : 'block'};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  height: ${props => props.view === 'list' ? '200px' : '250px'};
  width: ${props => props.view === 'list' ? '200px' : '100%'};
  flex-shrink: 0;
  position: relative;
`;

const ProductInfo = styled.div`
  padding: 24px;
  flex: 1;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 16px;
    line-height: 1.5;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffc107;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
`;

const AddToCartButton = styled(ActionButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const WishlistButton = styled(ActionButton)`
  background: ${props => props.$active ? '#ff6b6b' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 1px solid ${props => props.$active ? '#ff6b6b' : '#e1e5e9'};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${props => props.$active ? '#ff5252' : '#e9ecef'};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 60px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Products = () => {
  console.log('Products component rendering - version 2.0'); // Debug log to force refresh
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    skinType: searchParams.get('skinType') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { addItem } = useCartStore();
  const { user, addToWishlist, removeFromWishlist } = useAuthStore();

  // Fetch products with error handling
  const { data: productsData, isLoading, error } = useQuery(
    ['products', filters, currentPage],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });
      
      const response = await axios.get(`/api/products?${params}`);
      return response.data;
    },
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error('Error fetching products:', error);
      }
    }
  );

  // Fetch categories with error handling
  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get('/api/categories');
    return response.data;
  }, {
    onError: (error) => {
      console.error('Error fetching categories:', error);
    }
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleAddToCart = (product) => {
    if (product && product._id) {
      addItem(product);
    }
  };

  const handleWishlistToggle = (productId) => {
    if (!user || !productId) return;
    
    const isInWishlist = user.wishlist?.includes(productId);
    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // Safe string helper function
  const safeString = (str, fallback = '') => {
    return (str && typeof str === 'string' && str.length > 0) ? str : fallback;
  };

  // Removed safeCapitalize function as it's no longer needed

  const brands = ['AuraFix', 'Glow Beauty', 'Radiant', 'Pure Skin', 'Luxe'];
  const skinTypes = ['oily', 'dry', 'combination', 'sensitive', 'normal'];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading products: {error.message}</div>;

  return (
    <ProductsContainer>
      <Header>
        <h1>Our Products</h1>
        <Controls>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <SearchButton>
              <Search size={18} />
            </SearchButton>
          </SearchBox>
          
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} />
            Filters
            <ChevronDown size={16} />
          </FilterButton>

          <ViewToggle>
            <ViewButton 
              $active={view === 'grid'} 
              onClick={() => setView('grid')}
            >
              <Grid size={16} />
            </ViewButton>
            <ViewButton 
              $active={view === 'list'} 
              onClick={() => setView('list')}
            >
              <List size={16} />
            </ViewButton>
          </ViewToggle>
        </Controls>
      </Header>

      <AnimatePresence>
        {showFilters && (
          <FiltersPanel
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterGroup>
              <h3>Categories</h3>
              <FilterOptions>
                <FilterChip
                  $active={!filters.category}
                  onClick={() => handleFilterChange('category', '')}
                >
                  All
                </FilterChip>
                {Array.isArray(categories) && categories
                  .filter(category => category && category._id && category.name)
                  .map(category => (
                    <FilterChip
                      key={category._id}
                      $active={filters.category === category._id}
                      onClick={() => handleFilterChange('category', category._id)}
                    >
                      {safeString(category.name, 'Unknown Category')}
                    </FilterChip>
                  ))}
              </FilterOptions>
            </FilterGroup>

            <FilterGroup>
              <h3>Brands</h3>
              <FilterOptions>
                <FilterChip
                  $active={!filters.brand}
                  onClick={() => handleFilterChange('brand', '')}
                >
                  All
                </FilterChip>
                {Array.isArray(brands) && brands.map(brand => (
                  <FilterChip
                    key={brand}
                    $active={filters.brand === brand}
                    onClick={() => handleFilterChange('brand', brand)}
                  >
                    {brand}
                  </FilterChip>
                ))}
              </FilterOptions>
            </FilterGroup>

            <FilterGroup>
              <h3>Skin Type</h3>
              <FilterOptions>
                <FilterChip
                  $active={!filters.skinType}
                  onClick={() => handleFilterChange('skinType', '')}
                >
                  All
                </FilterChip>
                <FilterChip
                  key="oily"
                  $active={filters.skinType === 'oily'}
                  onClick={() => handleFilterChange('skinType', 'oily')}
                >
                  Oily
                </FilterChip>
                <FilterChip
                  key="dry"
                  $active={filters.skinType === 'dry'}
                  onClick={() => handleFilterChange('skinType', 'dry')}
                >
                  Dry
                </FilterChip>
                <FilterChip
                  key="combination"
                  $active={filters.skinType === 'combination'}
                  onClick={() => handleFilterChange('skinType', 'combination')}
                >
                  Combination
                </FilterChip>
                <FilterChip
                  key="sensitive"
                  $active={filters.skinType === 'sensitive'}
                  onClick={() => handleFilterChange('skinType', 'sensitive')}
                >
                  Sensitive
                </FilterChip>
                <FilterChip
                  key="normal"
                  $active={filters.skinType === 'normal'}
                  onClick={() => handleFilterChange('skinType', 'normal')}
                >
                  Normal
                </FilterChip>
              </FilterOptions>
            </FilterGroup>

            <FilterGroup>
              <h3>Price Range</h3>
              <PriceRange>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </PriceRange>
            </FilterGroup>
          </FiltersPanel>
        )}
      </AnimatePresence>

      {/* Filter out invalid products before mapping */}
      {(() => {
        const safeProducts = Array.isArray(productsData?.products)
          ? productsData.products.filter((p) => {
              if (!p || typeof p !== "object") return false;
              if (typeof p.name !== "string" || !p.name.trim()) return false;
              return true;
            })
          : [];

        return (
          <ProductsGrid view={view}>
            {safeProducts.length > 0 ? (
              safeProducts.map((product, index) => {
                // Skip invalid products
                if (!product || typeof product !== 'object' || !product._id) {
                  console.warn('Skipping invalid product:', product);
                  return null;
                }

                // Ensure all product data is safe before rendering
                const productName = product.name?.trim() || 'Unnamed Product';
                const productDescription = typeof product.shortDescription === 'string' 
                  ? product.shortDescription.trim() 
                  : 'No description available';

                // Safely parse price with fallback
                let productPrice = '0.00';
                if (typeof product.price === 'number') {
                  productPrice = product.price.toFixed(2);
                } else if (typeof product.price === 'string') {
                  const parsed = parseFloat(product.price);
                  if (!isNaN(parsed)) productPrice = parsed.toFixed(2);
                }

                // Safe rating with fallbacks
                const ratingAverage = 
                  typeof product.rating?.average === 'number' 
                    ? product.rating.average.toFixed(1)
                    : '0.0';
                
                const ratingCount = 
                  typeof product.rating?.count === 'number'
                    ? product.rating.count
                    : 0;

                return (
                  <ProductCard
                    key={`${product._id}-${index}`}
                    view={view}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductImage view={view}>
                      {Array.isArray(product.images) && product.images.length > 0 ? (
                        <img
                          src={typeof product.images[0] === 'object' ? product.images[0].url : product.images[0]}
                          alt={productName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400/f0f0f0/999999?text=No+Image';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                          borderRadius: '8px'
                        }}>
                          No Image Available
                        </div>
                      )}
                    </ProductImage>

                    <ProductInfo>
                      <h3>{productName}</h3>
                      <p>
                        {productDescription && productDescription.length > 100 
                          ? `${productDescription.slice(0, 100)}...`
                          : productDescription || 'No description available'}
                      </p>

                      <ProductMeta>
                        <Price>KES {productPrice}</Price>
                        <Rating>
                          <Star size={16} fill="currentColor" />
                          <span>{ratingAverage}</span>
                          <span>({ratingCount})</span>
                        </Rating>
                      </ProductMeta>

                      <ProductActions>
                        <AddToCartButton
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag size={18} />
                          Add to Cart
                        </AddToCartButton>

                        {user && (
                          <WishlistButton
                            $active={Array.isArray(user.wishlist) && user.wishlist.includes(product._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleWishlistToggle(product._id)}
                          >
                            <Heart size={18} />
                          </WishlistButton>
                        )}
                      </ProductActions>
                    </ProductInfo>
                  </ProductCard>
                );
              })
            ) : (
              <div>No products found</div>
            )}
          </ProductsGrid>
        );
      })()}

      {productsData?.totalPages > 1 && (
        <Pagination>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            title="First page"
          >
            ««
          </PageButton>
          
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            title="Previous page"
          >
            ‹ Previous
          </PageButton>
          
          {(() => {
            const totalPages = productsData.totalPages;
            const current = currentPage;
            const pages = [];
            
            // Always show first page
            if (current > 3) {
              pages.push(1);
              if (current > 4) pages.push('...');
            }
            
            // Show pages around current page
            for (let i = Math.max(1, current - 2); i <= Math.min(totalPages, current + 2); i++) {
              pages.push(i);
            }
            
            // Always show last page
            if (current < totalPages - 2) {
              if (current < totalPages - 3) pages.push('...');
              pages.push(totalPages);
            }
            
            return pages.map((page, index) => (
              page === '...' ? (
                <PageButton key={`ellipsis-${index}`} disabled>
                  ...
                </PageButton>
              ) : (
                <PageButton
                  key={page}
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  title={`Go to page ${page}`}
                >
                  {page}
                </PageButton>
              )
            ));
          })()}
          
          <PageButton
            disabled={currentPage === productsData.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            title="Next page"
          >
            Next ›
          </PageButton>
          
          <PageButton
            disabled={currentPage === productsData.totalPages}
            onClick={() => setCurrentPage(productsData.totalPages)}
            title="Last page"
          >
            »»
          </PageButton>
          
          <div style={{
            marginLeft: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#666',
            fontSize: '14px'
          }}>
            <span>Page {currentPage} of {productsData.totalPages}</span>
            <span>•</span>
            <span>{productsData.totalProducts} products total</span>
          </div>
        </Pagination>
      )}
    </ProductsContainer>
  );
};

export default Products;
