import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, Heart, Package, Settings, Edit2, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuery } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  margin-bottom: 40px;
  text-align: center;

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 48px;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    opacity: 0.9;
    font-size: 1.1rem;
  }
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

const TabButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  background: ${props => props.$active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  color: ${props => props.$active ? '#667eea' : '#666'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  margin-bottom: 8px;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const InputGroup = styled.div`
  label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 14px;
  }

  input {
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

    &:disabled {
      background: #f8f9fa;
      color: #666;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  &.secondary {
    background: #f8f9fa;
    color: #666;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const OrderCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .order-number {
      font-weight: 600;
      color: #333;
    }

    .order-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      background: ${props => {
        switch (props.status) {
          case 'delivered': return '#28a745';
          case 'shipped': return '#17a2b8';
          case 'processing': return '#ffc107';
          case 'pending': return '#6c757d';
          default: return '#6c757d';
        }
      }};
      color: white;
    }
  }

  .order-items {
    margin-bottom: 16px;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e1e5e9;

    &:last-child {
      border-bottom: none;
    }
  }

  .order-total {
    text-align: right;
    font-weight: 700;
    color: #667eea;
    font-size: 1.1rem;
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const WishlistItem = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  text-align: center;

  .product-image {
    width: 100%;
    height: 150px;
    background: #e1e5e9;
    border-radius: 8px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-name {
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  .product-price {
    color: #667eea;
    font-weight: 700;
    margin-bottom: 12px;
  }
`;

const Profile = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { user, updateProfile, isLoading } = useAuthStore();

  const { data: orders } = useQuery(
    'user-orders',
    async () => {
      const response = await axios.get('/api/orders/my-orders');
      return response.data.orders;
    },
    { enabled: activeTab === 'orders' }
  );

  const { data: wishlistProducts } = useQuery(
    'wishlist-products',
    async () => {
      if (!user?.wishlist?.length) return [];
      const promises = user.wishlist.map(id => 
        axios.get(`/api/products/${id}`).then(res => res.data)
      );
      return Promise.all(promises);
    },
    { enabled: activeTab === 'wishlist' && user?.wishlist?.length > 0 }
  );

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const result = await updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
    });

    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || ''
    });
    setIsEditing(false);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <div className="avatar">
          <User size={48} />
        </div>
        <h1>{user.firstName} {user.lastName}</h1>
        <p>{user.email}</p>
      </ProfileHeader>

      <ProfileContent>
        <Sidebar>
          <TabButton
            $active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile
          </TabButton>
          <TabButton
            $active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={20} />
            Orders
          </TabButton>
          <TabButton
            $active={activeTab === 'wishlist'}
            onClick={() => setActiveTab('wishlist')}
          >
            <Heart size={20} />
            Wishlist
          </TabButton>
          <TabButton
            $active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Settings
          </TabButton>
        </Sidebar>

        <MainContent>
          {activeTab === 'profile' && (
            <div>
              <SectionTitle>Profile Information</SectionTitle>
              <Form>
                <InputGroup>
                  <label>First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </InputGroup>
                <InputGroup>
                  <label>Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </InputGroup>
                <InputGroup>
                  <label>Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </InputGroup>
                <InputGroup>
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </InputGroup>
                <InputGroup>
                  <label>Street Address</label>
                  <input
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </InputGroup>
                <InputGroup>
                  <label>City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </InputGroup>
                <InputGroup>
                  <label>State</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </InputGroup>
                <InputGroup>
                  <label>ZIP Code</label>
                  <input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </InputGroup>
              </Form>

              <ButtonGroup>
                {isEditing ? (
                  <>
                    <Button
                      className="primary"
                      onClick={handleSave}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={16} />
                      Save Changes
                    </Button>
                    <Button
                      className="secondary"
                      onClick={handleCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X size={16} />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    className="primary"
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </Button>
                )}
              </ButtonGroup>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <SectionTitle>Order History</SectionTitle>
              {orders?.length > 0 ? (
                orders.map((order) => (
                  <OrderCard key={order._id} status={order.status}>
                    <div className="order-header">
                      <div className="order-number">Order #{order.orderNumber}</div>
                      <div className="order-status">{order.status}</div>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.product.name} x {item.quantity}</span>
                          <span>KES {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      Total: KES {order.total.toFixed(2)}
                    </div>
                  </OrderCard>
                ))
              ) : (
                <p>No orders found.</p>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <SectionTitle>My Wishlist</SectionTitle>
              {wishlistProducts?.length > 0 ? (
                <WishlistGrid>
                  {wishlistProducts.map((product) => (
                    <WishlistItem key={product._id}>
                      <div className="product-image">
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} />
                        ) : (
                          <Heart size={32} color="#ccc" />
                        )}
                      </div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">KES {product.price.toFixed(2)}</div>
                    </WishlistItem>
                  ))}
                </WishlistGrid>
              ) : (
                <p>Your wishlist is empty.</p>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <SectionTitle>Account Settings</SectionTitle>
              <p>Settings panel coming soon...</p>
            </div>
          )}
        </MainContent>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
