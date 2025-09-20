import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  Shield, 
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import ProductViewer from '../components/Product/ProductViewer';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 32px;
  transition: color 0.3s ease;

  &:hover {
    color: #5a6fd8;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ProductImages = styled.div`
  .main-viewer {
    height: 500px;
    margin-bottom: 20px;
  }

  .thumbnails {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 8px 0;
  }
`;

const Thumbnail = styled.button`
  width: 80px;
  height: 80px;
  border: 2px solid ${props => props.$active ? '#3b82f6' : '#e1e5e9'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    object-position: center;
    background-color: #f8f9fa;
  }

  &:hover {
    border-color: #3b82f6;
  }
`;

const ProductInfo = styled.div`
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: #333;
  }

  .brand {
    color: #3b82f6;
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 24px;
    font-size: 1.1rem;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  .stars {
    display: flex;
    gap: 2px;
    color: #ffc107;
  }

  .rating-text {
    color: #666;
    font-size: 14px;
  }
`;

const Price = styled.div`
  margin-bottom: 32px;

  .current-price {
    font-size: 2.5rem;
    font-weight: 700;
    color: #3b82f6;
  }

  .compare-price {
    font-size: 1.25rem;
    color: #999;
    text-decoration: line-through;
    margin-left: 12px;
  }

  .savings {
    color: #28a745;
    font-weight: 600;
    margin-top: 4px;
  }
`;

const Variants = styled.div`
  margin-bottom: 32px;

  h3 {
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
`;

const VariantOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const VariantOption = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#e1e5e9'};
  background: ${props => props.selected ? '#3b82f6' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: #3b82f6;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;

  label {
    font-weight: 600;
    color: #333;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    overflow: hidden;
  }

  button {
    width: 40px;
    height: 40px;
    border: none;
    background: #f8f9fa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;

    &:hover {
      background: #e9ecef;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  input {
    width: 60px;
    height: 40px;
    border: none;
    text-align: center;
    font-weight: 600;
    outline: none;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled(motion.button)`
  flex: 1;
  padding: 16px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const WishlistButton = styled(motion.button)`
  padding: 16px;
  background: ${props => props.$active ? '#ff6b6b' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 1px solid ${props => props.$active ? '#ff6b6b' : '#e1e5e9'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  .icon {
    color: #3b82f6;
  }

  .text {
    font-size: 14px;
    color: #666;
  }
`;

const Tabs = styled.div`
  border-top: 1px solid #e1e5e9;
  padding-top: 40px;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e1e5e9;
`;

const TabButton = styled.button`
  padding: 12px 0;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.active ? '#3b82f6' : '#666'};
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #3b82f6;
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }
`;

const TabContent = styled.div`
  line-height: 1.6;
  color: #666;

  h3 {
    color: #333;
    margin-bottom: 16px;
  }

  ul {
    padding-left: 20px;
    margin-bottom: 16px;
  }

  li {
    margin-bottom: 8px;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addItem } = useCartStore();
  const { user, addToWishlist, removeFromWishlist } = useAuthStore();

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    async () => {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    }
  );

  const handleAddToCart = () => {
    if (product) {
      addItem(product, selectedVariant, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (!user || !product) return;
    
    const isInWishlist = user.wishlist?.includes(product._id);
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  const currentPrice = selectedVariant?.price || product.price;
  const savings = product.comparePrice ? product.comparePrice - currentPrice : 0;

  return (
    <ProductContainer>
      <BackButton to="/products">
        <ArrowLeft size={20} />
        Back to Products
      </BackButton>

      <ProductGrid>
        <ProductImages>
          <div className="main-viewer">
            <ProductViewer 
              product={product}
              height="500px"
              showControls={true}
            />
          </div>
          
          {product.images && product.images.length > 0 && (
            <div className="thumbnails">
              {product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  $active={selectedImageIndex === index}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image.url} alt={image.alt} />
                </Thumbnail>
              ))}
            </div>
          )}
        </ProductImages>

        <ProductInfo>
          <div className="brand">{product.brand}</div>
          <h1>{product.name}</h1>
          <div className="description">{product.shortDescription}</div>

          <Rating>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(product.rating?.average || 0) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating?.average?.toFixed(1) || '0.0'} ({product.rating?.count || 0} reviews)
            </span>
          </Rating>

          <Price>
            <div>
              <span className="current-price">${currentPrice?.toFixed(2)}</span>
              {product.comparePrice && (
                <span className="compare-price">${product.comparePrice.toFixed(2)}</span>
              )}
            </div>
            {savings > 0 && (
              <div className="savings">Save ${savings.toFixed(2)}</div>
            )}
          </Price>

          {product.variants && product.variants.length > 0 && (
            <Variants>
              {product.variants.map((variant, index) => (
                <div key={index}>
                  <h3>{variant.name}</h3>
                  <VariantOptions>
                    {variant.options.map((option, optionIndex) => (
                      <VariantOption
                        key={optionIndex}
                        selected={selectedVariant?.value === option.value}
                        onClick={() => setSelectedVariant(option)}
                      >
                        {option.value}
                      </VariantOption>
                    ))}
                  </VariantOptions>
                </div>
              ))}
            </Variants>
          )}

          <QuantitySelector>
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button onClick={() => setQuantity(quantity + 1)}>
                <Plus size={16} />
              </button>
            </div>
          </QuantitySelector>

          <Actions>
            <AddToCartButton
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBag size={20} />
              Add to Cart
            </AddToCartButton>
            
            {user && (
              <WishlistButton
                $active={user.wishlist?.includes(product._id)}
                onClick={handleWishlistToggle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart size={20} />
              </WishlistButton>
            )}
          </Actions>

          <Features>
            <Feature>
              <div className="icon">
                <Truck size={20} />
              </div>
              <div className="text">Free shipping on orders over $50</div>
            </Feature>
            <Feature>
              <div className="icon">
                <RotateCcw size={20} />
              </div>
              <div className="text">30-day return policy</div>
            </Feature>
            <Feature>
              <div className="icon">
                <Shield size={20} />
              </div>
              <div className="text">Authentic products guaranteed</div>
            </Feature>
          </Features>
        </ProductInfo>
      </ProductGrid>

      <Tabs>
        <TabButtons>
          <TabButton
            $active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            Description
          </TabButton>
          <TabButton
            $active={activeTab === 'ingredients'}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </TabButton>
          <TabButton
            $active={activeTab === 'howToUse'}
            onClick={() => setActiveTab('howToUse')}
          >
            How to Use
          </TabButton>
          <TabButton
            $active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.rating?.count || 0})
          </TabButton>
        </TabButtons>

        <TabContent>
          {activeTab === 'description' && (
            <div>
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3>Ingredients</h3>
              {product.ingredients && product.ingredients.length > 0 ? (
                <ul>
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p>Ingredient information not available.</p>
              )}
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div>
              <h3>How to Use</h3>
              <p>{product.howToUse || 'Usage instructions not available.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3>Customer Reviews</h3>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', color: '#ffc107' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <span style={{ fontWeight: '600' }}>
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </TabContent>
      </Tabs>
    </ProductContainer>
  );
};

export default ProductDetail;
