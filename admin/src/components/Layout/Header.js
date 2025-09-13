import React from 'react';
import styled from 'styled-components';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  margin-right: 24px;

  input {
    width: 100%;
    padding: 8px 16px 8px 40px;
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationButton = styled.button`
  position: relative;
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

  .badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #f3f4f6;
  }

  .avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .name {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .role {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
    }
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.3s ease;

  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }
`;

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <HeaderContainer>
      <SearchContainer>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search products, orders, users..."
        />
      </SearchContainer>

      <HeaderActions>
        <NotificationButton>
          <Bell size={20} />
          <div className="badge" />
        </NotificationButton>

        <UserMenu>
          <div className="avatar">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="user-info">
            <div className="name">{user?.firstName} {user?.lastName}</div>
            <div className="role">{user?.role}</div>
          </div>
        </UserMenu>

        <LogoutButton onClick={logout} title="Logout">
          <LogOut size={20} />
        </LogoutButton>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
