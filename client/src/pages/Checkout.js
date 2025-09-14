import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CreditCard, Lock, MapPin, User, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 60px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 24px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 14px;
  }

  input, select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.error {
      border-color: #ff6b6b;
    }
  }

  .error-message {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 4px;
  }
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const PaymentMethod = styled.button`
  flex: 1;
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.1)' : 'white'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;

  &:hover {
    border-color: #667eea;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 100px;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 24px;
    color: #333;
  }
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .item-info {
    flex: 1;

    .name {
      font-weight: 500;
      color: #333;
    }

    .details {
      font-size: 14px;
      color: #666;
    }
  }

  .price {
    font-weight: 600;
    color: #333;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  font-size: ${props => props.large ? '1.25rem' : '1rem'};
  font-weight: ${props => props.bold ? '700' : '500'};
  color: ${props => props.total ? '#333' : '#666'};
  
  ${props => props.total && `
    padding-top: 16px;
    border-top: 2px solid #f0f0f0;
    margin-top: 24px;
  `}
`;

const PlaceOrderButton = styled(motion.button)`
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

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #28a745;
  font-size: 14px;
  margin-top: 16px;
  justify-content: center;
`;

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { items, getCartTotal, getShippingCost, getTax, getFinalTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      whatsappNumber: user?.phone || '',
      hostelName: user?.address?.hostelName || '',
      roomNumber: user?.address?.roomNumber || '',
      university: user?.address?.university || ''
    }
  });

  const sameAsBilling = watch('sameAsBilling', true);

  const processMpesaPayment = async (phoneNumber, amount) => {
    try {
      // Simulate M-Pesa STK push
      toast.loading('Sending M-Pesa payment request...', { duration: 2000 });
      
      // In a real implementation, you would call your M-Pesa API here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (in real app, you'd check actual payment status)
      toast.success('M-Pesa payment request sent! Check your phone for the STK push.');
      return { success: true, transactionId: `MP${Date.now()}` };
    } catch (error) {
      toast.error('Failed to process M-Pesa payment. Please try again.');
      return { success: false };
    }
  };

  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    try {
      let paymentResult = { success: true, transactionId: null };
      
      // Process M-Pesa payment if selected
      if (paymentMethod === 'mpesa') {
        paymentResult = await processMpesaPayment(data.mpesaPhone, getFinalTotal());
        if (!paymentResult.success) {
          setIsProcessing(false);
          return;
        }
      }

      // Debug cart items structure
      console.log('Cart items before mapping:', items);
      items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          product: item.product,
          productId: item.product?._id,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price
        });
      });

      const orderData = {
        items: items.map(item => {
          const mappedItem = {
            product: item.product?._id || item.product?.id || item.product,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price
          };
          console.log('Mapped item:', mappedItem);
          return mappedItem;
        }),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          street: `${data.hostelName}, ${data.roomNumber}`,
          city: data.university,
          state: 'Kenya',
          zipCode: '00100',
          country: 'Kenya',
          phone: data.whatsappNumber
        },
        billingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          street: `${data.hostelName}, ${data.roomNumber}`,
          city: data.university,
          state: 'Kenya',
          zipCode: '00100',
          country: 'Kenya',
          phone: data.whatsappNumber
        },
        paymentMethod,
        paymentId: paymentResult.transactionId || (paymentMethod === 'cod' ? null : `payment_${Date.now()}`),
        notes: `WhatsApp: ${data.whatsappNumber}, Email: ${data.email}${paymentMethod === 'mpesa' ? `, M-Pesa: ${data.mpesaPhone}` : ''}`
      };

      console.log('Sending order data:', orderData);
      const response = await axios.post('/api/orders', orderData);
      
      if (paymentMethod === 'mpesa') {
        toast.success('Order placed! M-Pesa payment processed successfully.');
      } else {
        toast.success('Order placed! We\'ll contact you on WhatsApp to arrange delivery.');
      }
      
      clearCart();
      navigate(`/profile?tab=orders`);
      
    } catch (error) {
      console.error('Order error:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        toast.error(`Validation error: ${error.response.data.errors[0]?.msg || 'Invalid data'}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <CheckoutContainer>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '700', 
        marginBottom: '40px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Checkout
      </h1>

      <CheckoutGrid>
        <CheckoutForm onSubmit={handleSubmit(onSubmit)}>
          <Section>
            <h2>
              <User size={24} />
              Contact Information
            </h2>
            
            <InputRow>
              <InputGroup>
                <label>First Name</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <div className="error-message">{errors.firstName.message}</div>}
              </InputGroup>

              <InputGroup>
                <label>Last Name</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <div className="error-message">{errors.lastName.message}</div>}
              </InputGroup>
            </InputRow>

            <InputRow>
              <InputGroup>
                <label>Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error-message">{errors.email.message}</div>}
              </InputGroup>

              <InputGroup>
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="0712345678"
                  {...register('whatsappNumber', { required: 'WhatsApp number is required' })}
                  className={errors.whatsappNumber ? 'error' : ''}
                />
                {errors.whatsappNumber && <div className="error-message">{errors.whatsappNumber.message}</div>}
              </InputGroup>
            </InputRow>
          </Section>

          <Section>
            <h2>
              <MapPin size={24} />
              Delivery Information
            </h2>

            <InputRow>
              <InputGroup>
                <label>Hostel Name</label>
                <input
                  placeholder="e.g. Mamlaka Hostel, University Hostel A"
                  {...register('hostelName', { required: 'Hostel name is required' })}
                  className={errors.hostelName ? 'error' : ''}
                />
                {errors.hostelName && <div className="error-message">{errors.hostelName.message}</div>}
              </InputGroup>

              <InputGroup>
                <label>Room/Block Number</label>
                <input
                  placeholder="e.g. Room 205, Block C"
                  {...register('roomNumber', { required: 'Room/Block number is required' })}
                  className={errors.roomNumber ? 'error' : ''}
                />
                {errors.roomNumber && <div className="error-message">{errors.roomNumber.message}</div>}
              </InputGroup>
            </InputRow>

            <InputGroup>
              <label>University/Area</label>
              <select {...register('university', { required: 'University/Area is required' })}>
                <option value="">Select your university/area</option>
                <option value="University of Nairobi">Egerton University</option>
                <option value="Kenyatta University">Kenyatta University</option>
                <option value="JKUAT">JKUAT</option>
                <option value="Strathmore University">Strathmore University</option>
                <option value="USIU">USIU</option>
                <option value="Daystar University">Daystar University</option>
                <option value="KU Ruiru Campus">KU Ruiru Campus</option>
                <option value="Other">Other</option>
              </select>
              {errors.university && <div className="error-message">{errors.university.message}</div>}
            </InputGroup>
          </Section>

          <Section>
            <h2>
              <CreditCard size={24} />
              Payment Method
            </h2>

            <PaymentMethods>
              <PaymentMethod
                type="button"
                selected={paymentMethod === 'cod'}
                onClick={() => setPaymentMethod('cod')}
              >
                <MapPin size={20} />
                Cash on Delivery
              </PaymentMethod>
              <PaymentMethod
                type="button"
                selected={paymentMethod === 'mpesa'}
                onClick={() => setPaymentMethod('mpesa')}
              >
                <Phone size={20} />
                M-Pesa
              </PaymentMethod>
            </PaymentMethods>

            {paymentMethod === 'mpesa' && (
              <>
                <InputGroup>
                  <label>M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0712345678 (same as WhatsApp or different)"
                    {...register('mpesaPhone', { required: 'M-Pesa phone number is required' })}
                    className={errors.mpesaPhone ? 'error' : ''}
                  />
                  {errors.mpesaPhone && <div className="error-message">{errors.mpesaPhone.message}</div>}
                </InputGroup>
                <div style={{ padding: '16px', background: '#e8f5e8', borderRadius: '8px', marginTop: '16px', border: '1px solid #4caf50' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#2e7d32', fontWeight: '500' }}>
                    📱 You will receive an M-Pesa STK push to complete payment. Make sure your phone is on and has sufficient balance.
                  </p>
                </div>
              </>
            )}

            {paymentMethod === 'cod' && (
              <div style={{ padding: '16px', background: '#fff3e0', borderRadius: '8px', marginTop: '16px', border: '1px solid #ff9800' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#e65100', fontWeight: '500' }}>
                  💰 Pay with cash when we deliver to your hostel. We'll contact you via WhatsApp to arrange delivery time.
                </p>
              </div>
            )}

            <SecurityBadge>
              <Lock size={16} />
              Your order information is secure and encrypted
            </SecurityBadge>
          </Section>
        </CheckoutForm>

        <OrderSummary>
          <h2>Order Summary</h2>
          
          {items.map((item) => (
            <OrderItem key={item.id}>
              <div className="item-info">
                <div className="name">{item.product.name}</div>
                <div className="details">
                  Qty: {item.quantity}
                  {item.variant && ` • ${item.variant.name}: ${item.variant.value}`}
                </div>
              </div>
              <div className="price">KES {(item.price * item.quantity).toFixed(2)}</div>
            </OrderItem>
          ))}

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

          <PlaceOrderButton
            type="submit"
            form="checkout-form"
            disabled={isProcessing}
            onClick={handleSubmit(onSubmit)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }} />
            ) : (
              <>
                <Lock size={20} />
                Place Order
              </>
            )}
          </PlaceOrderButton>
        </OrderSummary>
      </CheckoutGrid>
    </CheckoutContainer>
  );
};

export default Checkout;
