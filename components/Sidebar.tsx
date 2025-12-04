import React from 'react';
import { LayoutDashboard, BedDouble, Users, CalendarDays, CreditCard, PieChart, LogOut, Bot, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'rooms', label: 'Rooms', icon: BedDouble, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'guests', label: 'Guests', icon: Users, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'payments', label: 'Payments', icon: CreditCard, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'reports', label: 'Reports', icon: PieChart, roles: [UserRole.ADMIN] },
    { id: 'users', label: 'Staff Users', icon: Shield, roles: [UserRole.ADMIN] },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, roles: [UserRole.ADMIN, UserRole.STAFF] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole as UserRole));

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          HotelFlow
        </h1>
        <p className="text-slate-400 text-xs mt-1">Management System</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="mb-4 px-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Signed in as</p>
          <p className="font-semibold text-slate-200 truncate">{userRole}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white p-3 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};