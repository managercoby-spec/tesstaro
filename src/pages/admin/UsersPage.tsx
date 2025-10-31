// src/pages/admin/UsersPage.tsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/lib/supabase';
import { Users, UserCheck, UserX, Search, Shield, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const UsersPage: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0 });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      setStats({
        total: data?.length || 0,
        active: data?.filter(u => u.is_active).length || 0,
        admins: data?.filter(u => u.role === 'admin').length || 0,
      });
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      fetchUsers();
      alert(currentStatus ? 'User blocked successfully' : 'User activated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user status');
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    // تم التصحيح: استخدام علامات \` (backticks) للقوالب الحرفية
    if (!confirm(`Are you sure you want to make this user ${newRole}?`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      fetchUsers();
      // تم التصحيح: استخدام علامات \` (backticks)
      alert(`User role updated to ${newRole}`);
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update user role');
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    // تم التصحيح: استخدام علامات \` (backticks) للقوالب الحرفية
    if (!confirm(`Are you sure you want to delete ${email}? This cannot be undone!`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      fetchUsers();
      alert('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-white text-xl">Loading users...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Users Management</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Active Users</p>
                <p className="text-3xl font-bold mt-1">{stats.active}</p>
              </div>
              <UserCheck className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Admins</p>
                <p className="text-3xl font-bold mt-1">{stats.admins}</p>
              </div>
              <Shield className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{user.email}</div>
                      <div className="text-xs text-gray-400 mt-1">{user.id}</div>
                    </td>
                    {/* تم التصحيح: استخدام علامات \` (backticks) في className */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    {/* تم التصحيح: استخدام علامات \` (backticks) في className */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_active 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                          : 'bg-red-500/20 text-red-300 border border-red-500/50'
                      }`}>
                        {user.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleAdminRole(user.id, user.role)}
                          className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        
                        {/* تم التصحيح: استخدام علامات \` (backticks) في className */}
                        <button
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_active
                              ? 'text-red-400 hover:bg-red-500/20'
                              : 'text-green-400 hover:bg-green-500/20'
                          }`}
                          title={user.is_active ? 'Block User' : 'Activate User'}
                        >
                          {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => deleteUser(user.id, user.email)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No users found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
