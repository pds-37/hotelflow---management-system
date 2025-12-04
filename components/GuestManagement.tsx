import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { Guest } from '../types';
import { Plus, Search, User as UserIcon } from 'lucide-react';

export const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>(DataService.getGuests());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    fullName: '',
    email: '',
    phone: '',
    idProof: ''
  });

  const filteredGuests = guests.filter(g => 
    g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.phone.includes(searchTerm)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const guest: Guest = {
        id: Date.now().toString(),
        fullName: newGuest.fullName!,
        email: newGuest.email!,
        phone: newGuest.phone!,
        idProof: newGuest.idProof!,
        createdAt: new Date().toISOString()
    };
    DataService.saveGuest(guest);
    setGuests(DataService.getGuests());
    setIsModalOpen(false);
    setNewGuest({ fullName: '', email: '', phone: '', idProof: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Guest Directory</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add Guest
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search guests by name, email or phone..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuests.map(guest => (
          <div key={guest.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <UserIcon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{guest.fullName}</h3>
                <p className="text-sm text-gray-500 truncate">{guest.email}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-900">{guest.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID Proof:</span>
                    <span className="font-medium text-gray-900">{guest.idProof}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-bold text-gray-800">Add Guest</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" required value={newGuest.fullName} onChange={e => setNewGuest({...newGuest, fullName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required value={newGuest.email} onChange={e => setNewGuest({...newGuest, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" required value={newGuest.phone} onChange={e => setNewGuest({...newGuest, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Number</label>
                    <input type="text" required value={newGuest.idProof} onChange={e => setNewGuest({...newGuest, idProof: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};