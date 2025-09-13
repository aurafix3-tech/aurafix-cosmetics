import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useQuery } from 'react-query';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import axios from 'axios';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#667eea'};

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: ${props => props.color || '#667eea'}15;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.color || '#667eea'};
    }

    .trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 600;
      color: ${props => props.trend === 'up' ? '#10b981' : '#ef4444'};
    }
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .stat-label {
    color: #6b7280;
    font-size: 14px;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .chart-actions {
      display: flex;
      gap: 8px;
    }
  }
`;

const RecentActivity = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .activity-header {
    padding: 24px 24px 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
    }
  }

  .activity-list {
    max-height: 400px;
    overflow-y: auto;
  }
`;

const ActivityItem = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  .activity-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${props => props.type === 'order' ? '#dbeafe' : 
                        props.type === 'user' ? '#dcfce7' : 
                        props.type === 'product' ? '#fef3c7' : '#f3f4f6'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.type === 'order' ? '#1e40af' : 
                      props.type === 'user' ? '#166534' : 
                      props.type === 'product' ? '#92400e' : '#6b7280'};
  }

  .activity-content {
    flex: 1;

    .activity-text {
      color: #374151;
      font-size: 14px;
      margin-bottom: 2px;
    }

    .activity-time {
      color: #9ca3af;
      font-size: 12px;
    }
  }
`;

const AlertsSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const AlertItem = styled.div`
  padding: 12px 16px;
  background: ${props => props.type === 'warning' ? '#fef3c7' : '#fee2e2'};
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  .alert-icon {
    color: ${props => props.type === 'warning' ? '#d97706' : '#dc2626'};
  }

  .alert-text {
    color: ${props => props.type === 'warning' ? '#92400e' : '#991b1b'};
    font-size: 14px;
  }
`;

const Dashboard = () => {
  const { data: dashboardData, isLoading } = useQuery(
    'dashboard',
    async () => {
      const response = await axios.get('/api/admin/dashboard');
      return response.data;
    }
  );

  const { data: inventoryAlerts } = useQuery(
    'inventory-alerts',
    async () => {
      const response = await axios.get('/api/admin/inventory/alerts');
      return response.data;
    }
  );

  if (isLoading) return <LoadingSpinner />;

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${dashboardData?.stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: '#10b981',
      trend: 'up',
      change: '+12.5%'
    },
    {
      label: 'Total Orders',
      value: dashboardData?.stats?.totalOrders?.toLocaleString() || '0',
      icon: ShoppingCart,
      color: '#667eea',
      trend: 'up',
      change: '+8.2%'
    },
    {
      label: 'Total Products',
      value: dashboardData?.stats?.totalProducts?.toLocaleString() || '0',
      icon: Package,
      color: '#f59e0b',
      trend: 'up',
      change: '+3.1%'
    },
    {
      label: 'Total Users',
      value: dashboardData?.stats?.totalUsers?.toLocaleString() || '0',
      icon: Users,
      color: '#ef4444',
      trend: 'up',
      change: '+15.3%'
    }
  ];

  const revenueData = dashboardData?.monthlyStats?.map(stat => ({
    month: new Date(2024, stat._id - 1).toLocaleDateString('en', { month: 'short' }),
    revenue: stat.revenue,
    orders: stat.orders
  })) || [];

  const COLORS = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <DashboardContainer>
      <PageHeader>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store today.</p>
      </PageHeader>

      <StatsGrid>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <StatCard
              key={index}
              color={stat.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="stat-header">
                <div className="icon">
                  <Icon size={24} />
                </div>
                <div className="trend" trend={stat.trend}>
                  <TrendIcon size={16} />
                  {stat.change}
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </StatCard>
          );
        })}
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <div className="chart-header">
            <h3>Revenue Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#667eea"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <RecentActivity>
            <div className="activity-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {dashboardData?.recentOrders?.slice(0, 5).map((order, index) => (
                <ActivityItem key={index} type="order">
                  <div className="activity-icon">
                    <ShoppingCart size={16} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      New order #{order.orderNumber} from {order.user?.firstName}
                    </div>
                    <div className="activity-time">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </ActivityItem>
              ))}
            </div>
          </RecentActivity>

          <AlertsSection>
            <h3>
              <AlertTriangle size={20} />
              Inventory Alerts
            </h3>
            {inventoryAlerts?.lowStock?.slice(0, 3).map((product, index) => (
              <AlertItem key={index} type="warning">
                <AlertTriangle size={16} className="alert-icon" />
                <div className="alert-text">
                  {product.name} is running low ({product.stock} left)
                </div>
              </AlertItem>
            ))}
            {inventoryAlerts?.outOfStock?.slice(0, 2).map((product, index) => (
              <AlertItem key={`out-${index}`} type="error">
                <AlertTriangle size={16} className="alert-icon" />
                <div className="alert-text">
                  {product.name} is out of stock
                </div>
              </AlertItem>
            ))}
          </AlertsSection>
        </div>
      </ChartsGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
