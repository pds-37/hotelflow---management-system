import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Room, RoomStatus, RoomType, UserRole } from '../types';
import { Plus, Edit, Trash2, Filter, Save, X, Lock } from 'lucide-react';

interface RoomManagementProps {
    userRole: string;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({ userRole }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const isAdmin = userRole === UserRole.ADMIN;

  // Form State
  const [formData, setFormData] = useState<Partial<Room>>({
    number: '',
    type: RoomType.SINGLE,
    price: 0,
    capacity: 1,
    status: RoomStatus.AVAILABLE
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    setRooms(DataService.getRooms());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: Room = {
      id: editingRoom ? editingRoom.id : Date.now().toString(),
      number: formData.number!,
      type: formData.type!,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      status: formData.status!
    };

    DataService.saveRoom(newRoom);
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData({}); // reset
    loadRooms();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      DataService.deleteRoom(id);
      loadRooms();
    }
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingRoom(null);
    setFormData({
      number: '',
      type: RoomType.SINGLE,
      price: 100,
      capacity: 1,
      status: RoomStatus.AVAILABLE
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (status: RoomStatus) => {
    switch(status) {
      case RoomStatus.AVAILABLE: return 'bg-green-100 text-green-700';
      case RoomStatus.OCCUPIED: return 'bg-red-100 text-red-700';
      case RoomStatus.MAINTENANCE: return 'bg-yellow-100 text-yellow-700';
      case RoomStatus.CLEANING: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Room Management</h2>
        {isAdmin && (
            <button 
            onClick={openAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
            <Plus size={20} />
            Add Room
            </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Room No</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Capacity</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Price / Night</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                {isAdmin && <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{room.number}</td>
                  <td className="px-6 py-4 text-gray-600">{room.type}</td>
                  <td className="px-6 py-4 text-gray-600">{room.capacity} Guests</td>
                  <td className="px-6 py-4 text-gray-600">${room.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => openEdit(room)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                        </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {rooms.length === 0 && (
            <div className="p-8 text-center text-gray-500">No rooms found. Add one to get started.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as RoomType})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {Object.values(RoomType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                        type="number"
                        min="1"
                        required
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as RoomStatus})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                    {Object.values(RoomStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                    </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
                >
                  <Save size={18} />
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};