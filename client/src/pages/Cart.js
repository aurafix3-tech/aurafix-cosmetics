import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 60vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #5a6fd8;
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CartItem = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 8px;
  }

  .variant {
    font-size: 14px;
    color: #888;
    margin-bottom: 12px;
  }

  .price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #667eea;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;

  &:hover {
    background: #667eea;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  font-weight: 600;
  min-width: 24px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.1);
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: ${props => props.large ? '1.25rem' : '1rem'};
  font-weight: ${props => props.bold ? '700' : '500'};
  color: ${props => props.total ? '#333' : '#666'};
  
  ${props => props.total && `
    padding-top: 16px;
    border-top: 2px solid #f0f0f0;
    margin-top: 24px;
  `}
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  margin-top: 24px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;

  .icon {
    width: 120px;
    height: 120px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 32px;
    font-size: 1.1rem;
  }
`;

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Cart = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getCartTotal,
    getShippingCost,
    getTax,
    getFinalTotal,
    getCartCount
  } = useCartStore();
  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <CartContainer>
        <Header>
          <BackButton to="/products">
            <ArrowLeft size={20} />
            Continue Shopping
          </BackButton>
        </Header>
        
        <EmptyCart>
          <div className="icon">
            <ShoppingBag size={48} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <ShopButton to="/products">
            Start Shopping
            <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
          </ShopButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Header>
        <BackButton to="/products">
          <ArrowLeft size={20} />
          Continue Shopping
        </BackButton>
        <h1>Shopping Cart ({getCartCount()} items)</h1>
      </Header>

      <CartContent>
        <CartItems>
          <AnimatePresence>
            {items.map((item) => (
              <CartItem
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ItemImage>
                  {item.product.images?.[0]?.url ? (
                    <img src={item.product.images[0].url} alt={item.product.name} />
                  ) : (
                    <ShoppingBag size={32} color="#ccc" />
                  )}
                </ItemImage>

                <ItemInfo>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.shortDescription}</p>
                  {item.variant && (
                    <div className="variant">
                      {item.variant.name}: {item.variant.value}
                    </div>
                  )}
                  <div className="price">KES {item.price.toFixed(2)}</div>
                </ItemInfo>

                <QuantityControls>
                  <QuantityButton
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </QuantityButton>
                  <Quantity>{item.quantity}</Quantity>
                  <QuantityButton
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </QuantityButton>
                </QuantityControls>

                <RemoveButton onClick={() => removeItem(item.id)}>
                  <Trash2 size={20} />
                </RemoveButton>
              </CartItem>
            ))}
          </AnimatePresence>
        </CartItems>

        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <span>Subtotal</span>
            <span>KES {getCartTotal().toFixed(2)}</span>
          </SummaryRow>
          
          <SummaryRow>
            <span>Shipping</span>
            <span>{getShippingCost() === 0 ? 'Free' : `KES ${getShippingCost().toFixed(2)}`}</span>
          </SummaryRow>
          
          <SummaryRow>
            <span>Tax</span>
            <span>KES {getTax().toFixed(2)}</span>
          </SummaryRow>
          
          <SummaryRow total bold large>
            <span>Total</span>
            <span>KES {getFinalTotal().toFixed(2)}</span>
          </SummaryRow>

          <CheckoutButton
            onClick={handleCheckout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={20} />
            Proceed to Checkout
          </CheckoutButton>

        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
