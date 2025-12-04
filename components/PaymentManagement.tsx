import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { Booking, Payment, PaymentMethod, BookingStatus } from '../types';
import { CreditCard, DollarSign } from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(DataService.getPayments());
  const bookings = DataService.getBookings();
  const guests = DataService.getGuests();

  // New Payment
  const [selectedBooking, setSelectedBooking] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);

  // Filter only unpaid or checked-out bookings for payment selection might be a good UX, 
  // but for simplicity, show all valid bookings
  const validBookings = bookings.filter(b => b.status !== BookingStatus.CANCELLED);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || amount <= 0) return;

    const payment: Payment = {
        id: Date.now().toString(),
        bookingId: selectedBooking,
        amount: Number(amount),
        date: new Date().toISOString(),
        method: method
    };

    DataService.savePayment(payment);
    setPayments(DataService.getPayments());
    setSelectedBooking('');
    setAmount(0);
  };

  const getGuestName = (bookingId: string) => {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return 'Unknown';
      const guest = guests.find(g => g.id === booking.guestId);
      return guest ? guest.fullName : 'Unknown';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Payment History</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Guest</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Method</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {payments.slice().reverse().map(p => (
                        <tr key={p.id}>
                            <td className="px-6 py-4 text-gray-600">{new Date(p.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{getGuestName(p.bookingId)}</td>
                            <td className="px-6 py-4 text-gray-600">{p.method}</td>
                            <td className="px-6 py-4 text-right font-bold text-green-600">+${p.amount}</td>
                        </tr>
                    ))}
                    {payments.length === 0 && (
                        <tr><td colSpan={4} className="p-6 text-center text-gray-400">No payments recorded</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Record Payment</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Booking</label>
                    <select 
                        required 
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedBooking}
                        onChange={e => setSelectedBooking(e.target.value)}
                    >
                        <option value="">Select a booking...</option>
                        {validBookings.map(b => {
                            const guest = guests.find(g => g.id === b.guestId);
                            return (
                                <option key={b.id} value={b.id}>
                                    {guest?.fullName} - Room {DataService.getRooms().find(r => r.id === b.roomId)?.number} (${b.totalPrice})
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="number" 
                            required 
                            min="1"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.values(PaymentMethod).map(m => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMethod(m)}
                                className={`px-2 py-2 text-sm rounded-lg border transition-colors ${
                                    method === m 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium flex justify-center items-center gap-2">
                    <CreditCard size={18} />
                    Process Payment
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};