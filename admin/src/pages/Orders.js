import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Download
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const OrdersContainer = styled.div`
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
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
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

const OrdersGrid = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const OrdersTable = styled.table`
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

const OrderInfo = styled.div`
  .order-number {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
  }

  .order-date {
    font-size: 12px;
    color: #9ca3af;
  }
`;

const CustomerInfo = styled.div`
  .customer-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
  }

  .customer-email {
    font-size: 12px;
    color: #9ca3af;
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

const PaymentBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;

  &.paid {
    background: #dcfce7;
    color: #166534;
  }

  &.pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.failed {
    background: #fee2e2;
    color: #991b1b;
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
    border: none;
    background: none;
    width: 100%;
    text-align: left;

    &:hover {
      background: #f9fafb;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
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

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery(
    ['orders', { page: currentPage, search: searchTerm, status: statusFilter, payment: paymentFilter }],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(paymentFilter && { paymentStatus: paymentFilter })
      });
      
      const response = await axios.get(`/api/orders?${params}`);
      return response.data;
    }
  );

  const updateOrderStatusMutation = useMutation(
    async ({ orderId, status }) => {
      await axios.put(`/api/orders/${orderId}/status`, { status });
    },
    {
      onSuccess: () => {
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
        return <Clock size={12} />;
      case 'processing':
        return <Package size={12} />;
      case 'shipped':
        return <Truck size={12} />;
      case 'delivered':
        return <CheckCircle size={12} />;
      case 'cancelled':
        return <XCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
    setOpenMenuId(null);
  };

  if (isLoading) return <LoadingSpinner />;

  const orders = ordersData?.orders || [];
  const totalPages = Math.ceil((ordersData?.total || 0) / 10);

  return (
    <OrdersContainer>
      <PageHeader>
        <div className="header-left">
          <h1>Orders</h1>
          <p>Manage customer orders and fulfillment</p>
        </div>
        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download size={16} />
          Export Orders
        </ActionButton>
      </PageHeader>

      <FiltersCard>
        <SearchInput>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </FilterSelect>

        <FilterSelect
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </FilterSelect>
      </FiltersCard>

      <OrdersGrid>
        <OrdersTable>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <OrderInfo>
                    <div className="order-number">#{order.orderNumber}</div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </OrderInfo>
                </td>
                <td>
                  <CustomerInfo>
                    <div className="customer-name">
                      {order.user?.firstName} {order.user?.lastName}
                    </div>
                    <div className="customer-email">{order.user?.email}</div>
                  </CustomerInfo>
                </td>
                <td>
                  <StatusBadge className={order.status}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </StatusBadge>
                </td>
                <td>
                  <PaymentBadge className={order.paymentStatus}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </PaymentBadge>
                </td>
                <td>KES {order.total.toFixed(2)}</td>
                <td>
                  <ActionMenu>
                    <button
                      className="menu-button"
                      onClick={() => setOpenMenuId(openMenuId === order._id ? null : order._id)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenuId === order._id && (
                      <div className="menu-dropdown">
                        <Link to={`/orders/${order._id}`} className="menu-item">
                          <Eye size={14} />
                          View Details
                        </Link>
                        {order.status === 'pending' && (
                          <button
                            className="menu-item"
                            onClick={() => handleStatusUpdate(order._id, 'processing')}
                          >
                            <Package size={14} />
                            Mark Processing
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            className="menu-item"
                            onClick={() => handleStatusUpdate(order._id, 'shipped')}
                          >
                            <Truck size={14} />
                            Mark Shipped
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            className="menu-item"
                            onClick={() => handleStatusUpdate(order._id, 'delivered')}
                          >
                            <CheckCircle size={14} />
                            Mark Delivered
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            className="menu-item"
                            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          >
                            <XCircle size={14} />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    )}
                  </ActionMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </OrdersTable>

        <Pagination>
          <div className="pagination-info">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, ordersData?.total || 0)} of {ordersData?.total || 0} orders
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
      </OrdersGrid>
    </OrdersContainer>
  );
};

export default Orders;
