import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Calendar,
  Download
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

const AnalyticsContainer = styled.div`
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

const TimeFilter = styled.div`
  display: flex;
  gap: 8px;
  background: white;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  button {
    padding: 8px 16px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;

    &.active {
      background: #667eea;
      color: white;
    }

    &:hover:not(.active) {
      background: #f3f4f6;
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

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .stat-info {
      display: flex;
      align-items: center;
      gap: 12px;

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

      .stat-label {
        color: #6b7280;
        font-size: 14px;
        font-weight: 500;
      }
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

  .stat-change {
    font-size: 14px;
    color: #6b7280;
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
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const TopProductsCard = styled(ChartCard)`
  .product-list {
    .product-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .product-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .product-image {
          width: 40px;
          height: 40px;
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

        .product-details {
          .product-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
            margin-bottom: 2px;
          }

          .product-sales {
            font-size: 12px;
            color: #9ca3af;
          }
        }
      }

      .product-revenue {
        font-weight: 600;
        color: #1f2937;
      }
    }
  }
`;

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('30d');

  const { data: analyticsData, isLoading } = useQuery(
    ['analytics', timeFilter],
    async () => {
      const response = await axios.get(`/api/admin/analytics?period=${timeFilter}`);
      return response.data;
    }
  );

  if (isLoading) return <LoadingSpinner />;

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${analyticsData?.revenue?.total?.toLocaleString() || '0'}`,
      change: `${analyticsData?.revenue?.change || 0}% from last period`,
      trend: analyticsData?.revenue?.change >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: '#10b981'
    },
    {
      label: 'Total Orders',
      value: analyticsData?.orders?.total?.toLocaleString() || '0',
      change: `${analyticsData?.orders?.change || 0}% from last period`,
      trend: analyticsData?.orders?.change >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: '#667eea'
    },
    {
      label: 'New Customers',
      value: analyticsData?.customers?.new?.toLocaleString() || '0',
      change: `${analyticsData?.customers?.change || 0}% from last period`,
      trend: analyticsData?.customers?.change >= 0 ? 'up' : 'down',
      icon: Users,
      color: '#f59e0b'
    },
    {
      label: 'Products Sold',
      value: analyticsData?.products?.sold?.toLocaleString() || '0',
      change: `${analyticsData?.products?.change || 0}% from last period`,
      trend: analyticsData?.products?.change >= 0 ? 'up' : 'down',
      icon: Package,
      color: '#ef4444'
    }
  ];

  const revenueData = analyticsData?.revenueChart || [];
  const categoryData = analyticsData?.categoryBreakdown || [];
  const topProducts = analyticsData?.topProducts || [];

  const COLORS = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <AnalyticsContainer>
      <PageHeader>
        <div className="header-left">
          <h1>Analytics</h1>
          <p>Track your store performance and insights</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <TimeFilter>
            <button
              className={timeFilter === '7d' ? 'active' : ''}
              onClick={() => setTimeFilter('7d')}
            >
              7 Days
            </button>
            <button
              className={timeFilter === '30d' ? 'active' : ''}
              onClick={() => setTimeFilter('30d')}
            >
              30 Days
            </button>
            <button
              className={timeFilter === '90d' ? 'active' : ''}
              onClick={() => setTimeFilter('90d')}
            >
              90 Days
            </button>
            <button
              className={timeFilter === '1y' ? 'active' : ''}
              onClick={() => setTimeFilter('1y')}
            >
              1 Year
            </button>
          </TimeFilter>
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            Export Report
          </ActionButton>
        </div>
      </PageHeader>

      <StatsGrid>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <StatCard
              key={index}
              color={stat.color}
              trend={stat.trend}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="stat-header">
                <div className="stat-info">
                  <div className="icon">
                    <Icon size={24} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className="trend">
                  <TrendIcon size={16} />
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">{stat.change}</div>
            </StatCard>
          );
        })}
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <div className="chart-header">
            <h3>Revenue Trend</h3>
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
              <XAxis dataKey="date" />
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

        <ChartCard>
          <div className="chart-header">
            <h3>Sales by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <MetricsGrid>
        <TopProductsCard>
          <div className="chart-header">
            <h3>Top Selling Products</h3>
          </div>
          <div className="product-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <Package size={20} className="placeholder" />
                    )}
                  </div>
                  <div className="product-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-sales">{product.sales} sold</div>
                  </div>
                </div>
                <div className="product-revenue">${product.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </TopProductsCard>

        <ChartCard>
          <div className="chart-header">
            <h3>Order Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData?.orderStatus || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </MetricsGrid>
    </AnalyticsContainer>
  );
};

export default Analytics;
