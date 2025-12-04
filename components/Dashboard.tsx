import React, { useMemo } from 'react';
import { DataService } from '../services/dataService';
import { RoomStatus, BookingStatus, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, BedDouble, CalendarCheck, Lock } from 'lucide-react';

interface DashboardProps {
    userRole: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const rooms = DataService.getRooms();
  const bookings = DataService.getBookings();
  const guests = DataService.getGuests();
  const payments = DataService.getPayments();
  const isAdmin = userRole === UserRole.ADMIN;

  const stats = useMemo(() => {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const activeBookings = bookings.filter(b => b.status === BookingStatus.CHECKED_IN).length;
    const occupiedRooms = rooms.filter(r => r.status === RoomStatus.OCCUPIED).length;
    const availableRooms = rooms.filter(r => r.status === RoomStatus.AVAILABLE).length;
    
    return { totalRevenue, activeBookings, occupiedRooms, availableRooms, totalGuests: guests.length };
  }, [rooms, bookings, guests, payments]);

  const roomStatusData = useMemo(() => {
    const statusCounts = rooms.reduce((acc, room) => {
      acc[room.status] = (acc[room.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  }, [rooms]);

  const revenueData = useMemo(() => {
    // Group payments by date (last 7 entries for simplicity)
    const grouped = payments.reduce((acc, p) => {
      const date = p.date.split('T')[0];
      acc[date] = (acc[date] || 0) + p.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(grouped).sort().slice(-7).map(date => ({
      date,
      revenue: grouped[date]
    }));
  }, [payments]);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
            {isAdmin ? 'Administrator View' : 'Staff View'}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <DollarSign size={24} />
            </div>
            </div>
        ) : (
             <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between opacity-75">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Lock size={16} className="text-gray-400" />
                        <span className="text-gray-400 italic text-sm">Restricted</span>
                    </div>
                </div>
                <div className="p-3 bg-gray-100 text-gray-400 rounded-full">
                    <DollarSign size={24} />
                </div>
            </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Occupancy</p>
            <p className="text-2xl font-bold text-gray-900">{stats.occupiedRooms} / {rooms.length}</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <BedDouble size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Stays</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <CalendarCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Guests</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalGuests}</p>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isAdmin && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};