import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 200px;
  background: #f8fafc;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`;

const StatusOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  
  &.active {
    background: #dcfce7;
    color: #166534;
  }
  
  &.inactive {
    background: #fee2e2;
    color: #991b1b;
  }
  
  &.featured {
    background: #fef3c7;
    color: #92400e;
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;

const ProductTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #6b7280;
`;

const Price = styled.span`
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
`;

const Stock = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
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

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &.primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a67d8;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &.danger {
    background: #fee2e2;
    color: #dc2626;
    
    &:hover {
      background: #fecaca;
    }
  }
`;

const ProductCard = ({ product, onDelete, onToggleFeatured }) => {
  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  };

  const getStockText = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return `Low (${stock})`;
    return `${stock} in stock`;
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <ProductImageContainer>
        {product.images && product.images.length > 0 ? (
          <img
            src={typeof product.images[0] === 'object' ? 
              product.images[0].url : 
              product.images[0]
            }
            alt={product.name}
          />
        ) : (
          <div className="placeholder">
            <Package size={32} />
            <span>No Image</span>
          </div>
        )}
        
        <StatusOverlay>
          <Badge className={product.isActive ? 'active' : 'inactive'}>
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {product.isFeatured && (
            <Badge className="featured">Featured</Badge>
          )}
        </StatusOverlay>
      </ProductImageContainer>

      <CardContent>
        <ProductTitle>{product.name}</ProductTitle>
        
        <ProductMeta>
          <Price>KES {product.price}</Price>
          <Stock className={getStockStatus(product.stock)}>
            {getStockText(product.stock)}
          </Stock>
        </ProductMeta>

        <Actions>
          <ActionButton
            as={Link}
            to={`/products/${product._id}/edit`}
            className="primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit size={14} />
            Edit
          </ActionButton>
          
          <ActionButton
            className="secondary"
            onClick={() => onToggleFeatured(product._id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star size={14} />
            {product.isFeatured ? 'Unfeature' : 'Feature'}
          </ActionButton>
          
          <ActionButton
            className="danger"
            onClick={() => onDelete(product._id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 size={14} />
          </ActionButton>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
