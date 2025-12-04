import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { DataService } from '../services/dataService';
import { Bot, Send, Loader2, X } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}

export const AIChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'ai', text: 'Hello! I am your Hotel Assistant. How can I help you today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Gather context
        const rooms = DataService.getRooms();
        const guests = DataService.getGuests();
        const bookings = DataService.getBookings();
        const context = JSON.stringify({
            total_rooms: rooms.length,
            occupied_rooms: rooms.filter(r => r.status === 'Occupied').length,
            recent_bookings: bookings.slice(-5),
            guests_count: guests.length
        });

        const response = await GeminiService.askAssistant(userMsg.text, context);
        
        const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: response };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 z-40 flex items-center gap-2"
            >
                <Bot size={24} />
                <span className="font-semibold pr-2">AI Assistant</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-2xl flex justify-between items-center text-white shadow-md z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <Bot size={20} />
                    </div>
                    <h3 className="font-bold tracking-wide">Hotel Assistant</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2.5">
                            <Loader2 size={16} className="animate-spin text-blue-600" />
                            <span className="text-xs font-medium text-gray-500">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-5 border-t border-gray-100 bg-white rounded-b-2xl relative z-10 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3 items-center">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-inner"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
                    </button>
                </div>
            </form>
        </div>
    );
};
