import React from 'react';
import { DataService } from '../services/dataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const Reports: React.FC = () => {
    const bookings = DataService.getBookings();
    const payments = DataService.getPayments();

    // Booking Trends (by month)
    const bookingTrends = React.useMemo(() => {
        const trends: Record<string, number> = {};
        bookings.forEach(b => {
            const month = b.createdAt.substring(0, 7); // YYYY-MM
            trends[month] = (trends[month] || 0) + 1;
        });
        return Object.entries(trends).map(([name, value]) => ({ name, value })).sort((a,b) => a.name.localeCompare(b.name));
    }, [bookings]);

    // Payment Methods
    const paymentMethods = React.useMemo(() => {
        const methods: Record<string, number> = {};
        payments.forEach(p => {
            methods[p.method] = (methods[p.method] || 0) + p.amount;
        });
        return Object.entries(methods).map(([name, value]) => ({ name, value }));
    }, [payments]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Reports & Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Volume (Monthly)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bookingTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Payment Method</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={paymentMethods} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity Log</h3>
                <div className="text-sm text-gray-500">
                    <p>This section would typically contain a detailed audit log of all system actions (logins, updates, deletions) for admin review.</p>
                </div>
             </div>
        </div>
    );
};