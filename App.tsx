import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RoomManagement } from './components/RoomManagement';
import { GuestManagement } from './components/GuestManagement';
import { BookingManagement } from './components/BookingManagement';
import { PaymentManagement } from './components/PaymentManagement';
import { Reports } from './components/Reports';
import { UserManagement } from './components/UserManagement';
import { Login } from './components/Login';
import { AIChat } from './components/AIChat';
import { User, UserRole } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard userRole={user.role} />;
      case 'rooms': return <RoomManagement userRole={user.role} />;
      case 'guests': return <GuestManagement />;
      case 'bookings': return <BookingManagement />;
      case 'payments': return <PaymentManagement />;
      case 'reports': 
        return user.role === UserRole.ADMIN ? <Reports /> : <AccessDenied />;
      case 'users':
        return user.role === UserRole.ADMIN ? <UserManagement /> : <AccessDenied />;
      case 'ai-assistant': return (
        <div className="h-full flex items-center justify-center text-gray-500 flex-col gap-4">
             <div className="p-4 bg-blue-50 rounded-full text-blue-500">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 6.34 1.41-1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M12 22v-2"/><path d="m17.66 17.66 1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>
             </div>
             <p className="text-lg font-medium">Click the AI Assistant button in the bottom right corner to start chatting.</p>
        </div>
      );
      default: return <Dashboard userRole={user.role} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout} 
        userRole={user.role} 
      />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {renderContent()}
      </main>

      <AIChat />
    </div>
  );
}

const AccessDenied = () => (
    <div className="h-full flex flex-col items-center justify-center text-red-500">
        <h2 className="text-3xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to view this page.</p>
    </div>
);