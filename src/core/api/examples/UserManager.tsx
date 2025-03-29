/**
 * User Manager Component
 * 
 * Example component that demonstrates how to use TanStack Query with the API module.
 * Shows user listing, creation, editing, and deletion with optimistic updates.
 */
import React, { useState } from 'react';
import { userService, User, UserInput } from './userService';

/**
 * User list component with pagination
 */
export function UserList() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const { data, isLoading, error } = userService.usePaginatedUsers(page, pageSize);

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;
  if (!data) return <div>No users found</div>;

  return (
    <div>
      <h2>Users</h2>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <UserActions user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {data.totalPages || 1}
        </span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data || page >= data.totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * User details component
 */
export function UserDetail({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = userService.useUser(userId);

  if (isLoading) return <div>Loading user details...</div>;
  if (error) return <div>Error loading user: {error.message}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>User Details: {user.name}</h2>
      <dl>
        <dt>ID</dt>
        <dd>{user.id}</dd>
        
        <dt>Name</dt>
        <dd>{user.name}</dd>
        
        <dt>Email</dt>
        <dd>{user.email}</dd>
        
        <dt>Role</dt>
        <dd>{user.role}</dd>
      </dl>
    </div>
  );
}

/**
 * User actions component for edit/delete
 */
function UserActions({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Delete mutation
  const { mutate: deleteUser, isLoading: isDeleting } = 
    userService.useDeleteUser(user.id, {
      useOptimisticUpdate: true
    });
  
  return (
    <div>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button 
        onClick={() => {
          if (confirm('Are you sure you want to delete this user?')) {
            deleteUser();
          }
        }}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      
      {isEditing && (
        <UserEditForm 
          user={user} 
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

/**
 * User creation form
 */
export function UserCreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [userData, setUserData] = useState<UserInput>({
    name: '',
    email: '',
    role: 'user'
  });
  
  // Create mutation
  const { mutate: createUser, isLoading: isCreating, error } = 
    userService.useCreateUser({
      onSuccess: () => {
        setUserData({ name: '', email: '', role: 'user' });
        if (onSuccess) onSuccess();
      },
      useOptimisticUpdate: true
    });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(userData);
  };
  
  return (
    <div>
      <h3>Create New User</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Role:
            <select
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </label>
        </div>
        
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create User'}
        </button>
        
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      </form>
    </div>
  );
}

/**
 * User edit form
 */
function UserEditForm({ 
  user, 
  onCancel, 
  onSuccess 
}: { 
  user: User, 
  onCancel: () => void, 
  onSuccess?: () => void 
}) {
  const [userData, setUserData] = useState<UserInput>({
    name: user.name,
    email: user.email,
    role: user.role
  });
  
  // Update mutation
  const { mutate: updateUser, isLoading: isUpdating, error } = 
    userService.useUpdateUser(user.id, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      useOptimisticUpdate: true
    });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(userData);
  };
  
  return (
    <div>
      <h3>Edit User: {user.name}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Role:
            <select
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </label>
        </div>
        
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update User'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      </form>
    </div>
  );
}

/**
 * Main user manager component
 */
export function UserManager() {
  return (
    <div>
      <h1>User Management</h1>
      
      <UserCreateForm />
      
      <hr />
      
      <UserList />
    </div>
  );
}

export default UserManager;