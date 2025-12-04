import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { User, UserRole } from '../types';
import { Plus, Trash2, Shield, User as UserIcon, X, Save } from 'lucide-react';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [newUser, setNewUser] = useState<Partial<User>>({
        username: '',
        name: '',
        role: UserRole.STAFF
    });

    useEffect(() => {
        setUsers(DataService.getUsers());
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const user: User = {
            id: Date.now().toString(),
            username: newUser.username!,
            name: newUser.name!,
            role: newUser.role!
        };
        DataService.saveUser(user);
        setUsers(DataService.getUsers());
        setIsModalOpen(false);
        setNewUser({ username: '', name: '', role: UserRole.STAFF });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Remove this user?')) {
            DataService.deleteUser(id);
            setUsers(DataService.getUsers());
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Staff Management</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
                >
                    <Plus size={20} />
                    Add Staff
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {user.role === UserRole.ADMIN ? <Shield size={24} /> : <UserIcon size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                                        user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            {user.username !== 'admin' && (
                                <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h3 className="text-lg font-bold text-gray-800">Add Staff Member</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input type="text" required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select 
                                    value={newUser.role} 
                                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value={UserRole.STAFF}>Staff</option>
                                    <option value={UserRole.ADMIN}>Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                                    <Save size={18} /> Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};