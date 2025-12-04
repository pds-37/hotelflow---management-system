import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Booking, Room, Guest, BookingStatus } from '../types';
import { Plus, Check, X, Calendar } from 'lucide-react';

export const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Booking State
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedGuest, setSelectedGuest] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBookings(DataService.getBookings());
    setRooms(DataService.getRooms());
    setGuests(DataService.getGuests());
  };

  const calculateTotal = (roomId: string, start: string, end: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || !start || !end) return 0;
    
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return diffDays * room.price;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (new Date(checkIn) >= new Date(checkOut)) {
        setError('Check-out date must be after check-in date');
        return;
    }

    const isAvailable = DataService.checkAvailability(selectedRoom, checkIn, checkOut);
    if (!isAvailable) {
        setError('Room is not available for these dates.');
        return;
    }

    const booking: Booking = {
        id: Date.now().toString(),
        roomId: selectedRoom,
        guestId: selectedGuest,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: calculateTotal(selectedRoom, checkIn, checkOut),
        status: BookingStatus.CONFIRMED,
        createdAt: new Date().toISOString()
    };

    DataService.saveBooking(booking);
    setIsModalOpen(false);
    resetForm();
    loadData();
  };

  const updateStatus = (booking: Booking, status: BookingStatus) => {
      const updated = { ...booking, status };
      DataService.saveBooking(updated);
      loadData();
  };

  const resetForm = () => {
      setSelectedRoom('');
      setSelectedGuest('');
      setCheckIn('');
      setCheckOut('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Bookings</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          New Booking
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Guest</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Room</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Check-In</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Check-Out</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => {
                const guest = guests.find(g => g.id === booking.guestId);
                const room = rooms.find(r => r.id === booking.roomId);
                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{guest?.fullName || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-600">Room {room?.number}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.checkInDate}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.checkOutDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold
                        ${booking.status === BookingStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' : ''}
                        ${booking.status === BookingStatus.CHECKED_IN ? 'bg-green-100 text-green-800' : ''}
                        ${booking.status === BookingStatus.CHECKED_OUT ? 'bg-gray-100 text-gray-800' : ''}
                        ${booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {booking.status === BookingStatus.CONFIRMED && (
                            <div className="flex justify-end gap-2">
                                <button title="Check In" onClick={() => updateStatus(booking, BookingStatus.CHECKED_IN)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check size={16} /></button>
                                <button title="Cancel" onClick={() => updateStatus(booking, BookingStatus.CANCELLED)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><X size={16} /></button>
                            </div>
                        )}
                        {booking.status === BookingStatus.CHECKED_IN && (
                             <button onClick={() => updateStatus(booking, BookingStatus.CHECKED_OUT)} className="text-xs bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">Check Out</button>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-bold text-gray-800">New Booking</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest</label>
                    <select required className="w-full border p-2 rounded" value={selectedGuest} onChange={e => setSelectedGuest(e.target.value)}>
                        <option value="">Select Guest</option>
                        {guests.map(g => <option key={g.id} value={g.id}>{g.fullName} ({g.phone})</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                    <select required className="w-full border p-2 rounded" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}>
                        <option value="">Select Room</option>
                        {rooms.map(r => <option key={r.id} value={r.id}>{r.number} - {r.type} (${r.price})</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                        <input type="date" required className="w-full border p-2 rounded" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                        <input type="date" required className="w-full border p-2 rounded" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                    </div>
                </div>
                
                {selectedRoom && checkIn && checkOut && (
                    <div className="p-3 bg-blue-50 text-blue-800 rounded text-center font-bold">
                        Total Price: ${calculateTotal(selectedRoom, checkIn, checkOut)}
                    </div>
                )}

                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Booking</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};