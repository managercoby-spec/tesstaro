 // src/components/admin/AdminLayout.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Video, BarChart3, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/videos', icon: Video, label: 'Videos' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-8">Admin Panel</h1>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-all mb-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Site</span>
            </Link>
            
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
