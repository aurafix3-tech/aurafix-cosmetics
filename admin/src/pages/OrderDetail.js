import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Edit
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const OrderDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.3s ease;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
`;

const StatusButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  border: none;

  &.processing {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white;
  }

  &.shipped {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
  }

  &.delivered {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  &.cancelled {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .info-item {
    .label {
      font-size: 12px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &.pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.processing {
    background: #dbeafe;
    color: #1e40af;
  }

  &.shipped {
    background: #e0e7ff;
    color: #3730a3;
  }

  &.delivered {
    background: #dcfce7;
    color: #166534;
  }

  &.cancelled {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const OrderItems = styled.div`
  .item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 64px;
      height: 64px;
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

    .item-details {
      flex: 1;

      .item-name {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
      }

      .item-variant {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 4px;
      }

      .item-quantity {
        font-size: 14px;
        color: #9ca3af;
      }
    }

    .item-price {
      font-weight: 600;
      color: #1f2937;
    }
  }
`;

const OrderSummary = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  margin-top: 20px;

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &.total {
      font-weight: 700;
      font-size: 18px;
      color: #1f2937;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      margin-top: 12px;
    }

    .label {
      color: #6b7280;
    }

    .value {
      color: #1f2937;
      font-weight: 600;
    }
  }
`;

const CustomerCard = styled(Card)`
  .customer-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-list {
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #6b7280;
        font-size: 14px;

        &:last-child {
          margin-bottom: 0;
        }

        .icon {
          color: #9ca3af;
        }
      }
    }
  }
`;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery(
    ['order', id],
    async () => {
      const response = await axios.get(`/api/orders/${id}`);
      return response.data;
    }
  );

  const updateStatusMutation = useMutation(
    async (status) => {
      await axios.put(`/api/orders/${id}/status`, { status });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', id]);
        queryClient.invalidateQueries('orders');
        toast.success('Order status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update order status');
      }
    }
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <Package size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getNextStatusAction = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return { status: 'processing', label: 'Mark Processing', icon: Package };
      case 'processing':
        return { status: 'shipped', label: 'Mark Shipped', icon: Truck };
      case 'shipped':
        return { status: 'delivered', label: 'Mark Delivered', icon: CheckCircle };
      default:
        return null;
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!order) return <div>Order not found</div>;

  const nextAction = getNextStatusAction(order.status);

  return (
    <OrderDetailContainer>
      <PageHeader>
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/orders')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Order #{order.orderNumber}</h1>
        </div>
        <div className="header-actions">
          {nextAction && (
            <StatusButton
              className={nextAction.status}
              onClick={() => updateStatusMutation.mutate(nextAction.status)}
              disabled={updateStatusMutation.isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <nextAction.icon size={16} />
              {updateStatusMutation.isLoading ? 'Updating...' : nextAction.label}
            </StatusButton>
          )}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <StatusButton
              className="cancelled"
              onClick={() => updateStatusMutation.mutate('cancelled')}
              disabled={updateStatusMutation.isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <XCircle size={16} />
              Cancel Order
            </StatusButton>
          )}
        </div>
      </PageHeader>

      <OrderGrid>
        <div>
          <Card>
            <h3>Order Details</h3>
            
            <OrderInfo>
              <div className="info-item">
                <div className="label">Order Number</div>
                <div className="value">#{order.orderNumber}</div>
              </div>
              <div className="info-item">
                <div className="label">Order Date</div>
                <div className="value">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="info-item">
                <div className="label">Status</div>
                <div className="value">
                  <StatusBadge className={order.status}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </StatusBadge>
                </div>
              </div>
              <div className="info-item">
                <div className="label">Payment Method</div>
                <div className="value">{order.paymentMethod}</div>
              </div>
            </OrderInfo>

            <h4 style={{ marginBottom: '16px', color: '#1f2937' }}>Order Items</h4>
            <OrderItems>
              {order.items.map((item, index) => (
                <div key={index} className="item">
                  <div className="item-image">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <Package size={24} className="placeholder" />
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.product?.name || 'Product'}</div>
                    {item.variant && (
                      <div className="item-variant">
                        {item.variant.name}: {item.variant.value}
                      </div>
                    )}
                    <div className="item-quantity">Quantity: {item.quantity}</div>
                  </div>
                  <div className="item-price">KES {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </OrderItems>

            <OrderSummary>
              <div className="summary-row">
                <span className="label">Subtotal</span>
                <span className="value">KES {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="label">Tax (16% VAT)</span>
                <span className="value">KES {order.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span className="label">Total</span>
                <span className="value">KES {order.total.toFixed(2)}</span>
              </div>
            </OrderSummary>
          </Card>
        </div>

        <div>
          <CustomerCard>
            <h3>
              <User size={20} />
              Customer Information
            </h3>

            <div className="customer-section">
              <h4>
                <User size={16} />
                Contact Details
              </h4>
              <div className="info-list">
                <div className="info-item">
                  <User size={14} className="icon" />
                  {order.user?.firstName} {order.user?.lastName}
                </div>
                <div className="info-item">
                  <Mail size={14} className="icon" />
                  {order.user?.email}
                </div>
                {order.user?.phone && (
                  <div className="info-item">
                    <Phone size={14} className="icon" />
                    {order.user.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="customer-section">
              <h4>
                <MapPin size={16} />
                Shipping Address
              </h4>
              <div className="info-list">
                <div className="info-item">
                  <MapPin size={14} className="icon" />
                  {order.shippingAddress.street}
                </div>
                <div className="info-item">
                  <MapPin size={14} className="icon" />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
                <div className="info-item">
                  <MapPin size={14} className="icon" />
                  {order.shippingAddress.country}
                </div>
              </div>
            </div>

            <div className="customer-section">
              <h4>
                <CreditCard size={16} />
                Payment Information
              </h4>
              <div className="info-list">
                <div className="info-item">
                  <CreditCard size={14} className="icon" />
                  {order.paymentMethod}
                </div>
                <div className="info-item">
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: '600',
                    background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                    color: order.paymentStatus === 'paid' ? '#166534' : '#92400e'
                  }}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </CustomerCard>
        </div>
      </OrderGrid>
    </OrderDetailContainer>
  );
};

export default OrderDetail;
