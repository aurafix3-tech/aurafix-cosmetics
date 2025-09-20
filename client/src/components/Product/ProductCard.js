import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

const ProductCardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
  }
  
  @media (max-width: 768px) {
    border-radius: 16px;
    
    &:hover {
      transform: translateY(-5px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 12px;
    margin: 0;
  }
`;

const ImageContainer = styled.div`
  height: 250px;
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(147, 197, 253, 0.1) 50%, 
    rgba(219, 234, 254, 0.1) 100%);
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 200px;
  }
  
  @media (max-width: 480px) {
    height: 180px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ProductCardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 50%,
    rgba(147, 197, 253, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ProductCardContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s ease;
  
  ${ProductCardContainer}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ActionButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ProductInfo = styled.div`
  padding: 20px;
  
  h3 {
    color: #1e293b;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  p {
    color: #64748b;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    
    h3 {
      font-size: 16px;
    }
    
    p {
      font-size: 13px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    
    h3 {
      font-size: 15px;
    }
    
    p {
      font-size: 12px;
      -webkit-line-clamp: 1;
    }
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .current-price {
    color: #3b82f6;
    font-size: 20px;
    font-weight: 700;
  }
  
  .original-price {
    color: #94a3b8;
    font-size: 16px;
    text-decoration: line-through;
  }
  
  .discount {
    background: #ef4444;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fbbf24;
  font-size: 14px;
  
  .rating-text {
    color: #64748b;
    margin-left: 4px;
  }
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 13px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
    gap: 4px;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
`;

const ProductCard = ({ product, onAddToCart, onViewDetails, onToggleWishlist, isInWishlist = false }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails?.(product);
  };

  const getImageUrl = () => {
    if (product?.images && product.images.length > 0) {
      if (typeof product.images[0] === 'object' && product.images[0].url) {
        return product.images[0].url;
      }
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    return null;
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      return discount > 0 ? discount : null;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const discount = calculateDiscount();

  return (
    <ProductCardContainer
      onClick={handleViewDetails}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        {imageUrl && !imageError ? (
          <ProductImage
            src={imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderImage>
            {product.name || 'Product Image'}
          </PlaceholderImage>
        )}
        
        <ImageOverlay />
        
        {discount && (
          <Badge>
            -{discount}% OFF
          </Badge>
        )}
        
        <ActionButtons>
          <ActionButton
            onClick={handleToggleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              size={18} 
              fill={isInWishlist ? 'currentColor' : 'none'} 
            />
          </ActionButton>
          <ActionButton
            onClick={handleViewDetails}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="View details"
          >
            <Eye size={18} />
          </ActionButton>
        </ActionButtons>
      </ImageContainer>
      
      <ProductInfo>
        <h3>{product.name}</h3>
        <p>{product.shortDescription || product.description}</p>
        
        <PriceSection>
          <Price>
            <span className="current-price">KSH {product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">KSH {product.originalPrice}</span>
            )}
            {discount && (
              <span className="discount">-{discount}%</span>
            )}
          </Price>
          
          {product.rating && (
            <Rating>
              <Star size={16} fill="currentColor" />
              <span>
                {typeof product.rating === 'object' 
                  ? product.rating.average || product.rating.count || 0
                  : product.rating
                }
              </span>
              {(product.reviewCount || (typeof product.rating === 'object' && product.rating.count)) && (
                <span className="rating-text">
                  ({product.reviewCount || product.rating.count})
                </span>
              )}
            </Rating>
          )}
        </PriceSection>
        
        <AddToCartButton
          onClick={handleAddToCart}
          disabled={isLoading || !product.inStock}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart size={18} />
          {isLoading ? 'Adding...' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
        </AddToCartButton>
      </ProductInfo>
    </ProductCardContainer>
  );
};

export default ProductCard;
