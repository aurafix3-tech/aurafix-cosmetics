import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MoreHorizontal,
  User,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
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

const UsersGrid = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const UsersTable = styled.table`
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }

  .user-details {
    .user-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .user-email {
      font-size: 12px;
      color: #9ca3af;
    }
  }
`;

const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &.admin {
    background: #fee2e2;
    color: #991b1b;
  }

  &.user {
    background: #dbeafe;
    color: #1e40af;
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

  &.active {
    background: #dcfce7;
    color: #166534;
  }

  &.inactive {
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

    &.danger {
      color: #dc2626;

      &:hover {
        background: #fee2e2;
      }
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

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery(
    ['users', { page: currentPage, search: searchTerm, role: roleFilter, status: statusFilter }],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter })
      });
      
      const response = await axios.get(`/api/admin/users?${params}`);
      return response.data;
    }
  );

  const updateUserStatusMutation = useMutation(
    async ({ userId, status }) => {
      await axios.put(`/api/admin/users/${userId}/status`, { status });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update user status');
      }
    }
  );

  const updateUserRoleMutation = useMutation(
    async ({ userId, role }) => {
      await axios.put(`/api/admin/users/${userId}/role`, { role });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User role updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update user role');
      }
    }
  );

  const handleStatusUpdate = (userId, newStatus) => {
    updateUserStatusMutation.mutate({ userId, status: newStatus });
    setOpenMenuId(null);
  };

  const handleRoleUpdate = (userId, newRole) => {
    updateUserRoleMutation.mutate({ userId, role: newRole });
    setOpenMenuId(null);
  };

  if (isLoading) return <LoadingSpinner />;

  const users = usersData?.users || [];
  const totalPages = Math.ceil((usersData?.total || 0) / 10);

  return (
    <UsersContainer>
      <PageHeader>
        <div className="header-left">
          <h1>Users</h1>
          <p>Manage user accounts and permissions</p>
        </div>
      </PageHeader>

      <FiltersCard>
        <SearchInput>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </FilterSelect>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </FilterSelect>
      </FiltersCard>

      <UsersGrid>
        <UsersTable>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <UserInfo>
                    <div className="user-avatar">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </UserInfo>
                </td>
                <td>
                  <RoleBadge className={user.role}>
                    {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </RoleBadge>
                </td>
                <td>
                  <StatusBadge className={user.status || 'active'}>
                    {(user.status || 'active') === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {((user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1))}
                  </StatusBadge>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.orderCount || 0}</td>
                <td>
                  <ActionMenu>
                    <button
                      className="menu-button"
                      onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenuId === user._id && (
                      <div className="menu-dropdown">
                        <button className="menu-item">
                          <Mail size={14} />
                          Send Email
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            className="menu-item"
                            onClick={() => handleRoleUpdate(user._id, 'admin')}
                          >
                            <Shield size={14} />
                            Make Admin
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button
                            className="menu-item"
                            onClick={() => handleRoleUpdate(user._id, 'customer')}
                          >
                            <User size={14} />
                            Remove Admin
                          </button>
                        )}
                        {(user.status || 'active') === 'active' ? (
                          <button
                            className="menu-item danger"
                            onClick={() => handleStatusUpdate(user._id, 'inactive')}
                          >
                            <Ban size={14} />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="menu-item"
                            onClick={() => handleStatusUpdate(user._id, 'active')}
                          >
                            <CheckCircle size={14} />
                            Activate
                          </button>
                        )}
                      </div>
                    )}
                  </ActionMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </UsersTable>

        <Pagination>
          <div className="pagination-info">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, usersData?.total || 0)} of {usersData?.total || 0} users
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
      </UsersGrid>
    </UsersContainer>
  );
};

export default Users;
