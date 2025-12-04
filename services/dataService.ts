import { Room, Guest, Booking, Payment, User, UserRole, RoomStatus, RoomType, BookingStatus } from '../types';

// Initial Mock Data
const INITIAL_ROOMS: Room[] = [
  { id: '1', number: '101', type: RoomType.SINGLE, price: 100, capacity: 1, status: RoomStatus.AVAILABLE },
  { id: '2', number: '102', type: RoomType.DOUBLE, price: 150, capacity: 2, status: RoomStatus.OCCUPIED },
  { id: '3', number: '201', type: RoomType.SUITE, price: 300, capacity: 4, status: RoomStatus.AVAILABLE },
  { id: '4', number: '202', type: RoomType.DELUXE, price: 200, capacity: 2, status: RoomStatus.MAINTENANCE },
];

const INITIAL_GUESTS: Guest[] = [
  { id: '1', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', idProof: 'AB123456', createdAt: new Date().toISOString() },
  { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', idProof: 'XY987654', createdAt: new Date().toISOString() },
];

const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', role: UserRole.ADMIN, name: 'System Admin' },
  { id: '2', username: 'staff', role: UserRole.STAFF, name: 'Front Desk' },
];

// Helper to manage local storage
const getStorage = <T>(key: string, initial: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initial;
  } catch {
    return initial;
  }
};

const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const DataService = {
  // Rooms
  getRooms: (): Room[] => getStorage('hms_rooms', INITIAL_ROOMS),
  saveRoom: (room: Room) => {
    const rooms = DataService.getRooms();
    const existingIndex = rooms.findIndex(r => r.id === room.id);
    if (existingIndex >= 0) {
      rooms[existingIndex] = room;
    } else {
      rooms.push(room);
    }
    setStorage('hms_rooms', rooms);
  },
  deleteRoom: (id: string) => {
    const rooms = DataService.getRooms().filter(r => r.id !== id);
    setStorage('hms_rooms', rooms);
  },

  // Guests
  getGuests: (): Guest[] => getStorage('hms_guests', INITIAL_GUESTS),
  saveGuest: (guest: Guest) => {
    const guests = DataService.getGuests();
    const existingIndex = guests.findIndex(g => g.id === guest.id);
    if (existingIndex >= 0) {
      guests[existingIndex] = guest;
    } else {
      guests.push(guest);
    }
    setStorage('hms_guests', guests);
  },

  // Bookings
  getBookings: (): Booking[] => getStorage('hms_bookings', []),
  saveBooking: (booking: Booking) => {
    const bookings = DataService.getBookings();
    const existingIndex = bookings.findIndex(b => b.id === booking.id);
    if (existingIndex >= 0) {
      bookings[existingIndex] = booking;
    } else {
      bookings.push(booking);
    }
    setStorage('hms_bookings', bookings);
    
    // Auto-update room status if checked in
    if (booking.status === BookingStatus.CHECKED_IN) {
        const rooms = DataService.getRooms();
        const roomIdx = rooms.findIndex(r => r.id === booking.roomId);
        if (roomIdx >= 0) {
            rooms[roomIdx].status = RoomStatus.OCCUPIED;
            setStorage('hms_rooms', rooms);
        }
    } else if (booking.status === BookingStatus.CHECKED_OUT) {
        const rooms = DataService.getRooms();
        const roomIdx = rooms.findIndex(r => r.id === booking.roomId);
        if (roomIdx >= 0) {
            rooms[roomIdx].status = RoomStatus.CLEANING; // Set to cleaning after checkout
            setStorage('hms_rooms', rooms);
        }
    }
  },
  
  // Payments
  getPayments: (): Payment[] => getStorage('hms_payments', []),
  savePayment: (payment: Payment) => {
    const payments = DataService.getPayments();
    payments.push(payment);
    setStorage('hms_payments', payments);
  },

  // Users (Staff Management)
  getUsers: (): User[] => getStorage('hms_users', INITIAL_USERS),
  saveUser: (user: User) => {
    const users = DataService.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    setStorage('hms_users', users);
  },
  deleteUser: (id: string) => {
      const users = DataService.getUsers().filter(u => u.id !== id);
      setStorage('hms_users', users);
  },

  // Auth (Mock)
  login: (username: string): User | null => {
    const users = DataService.getUsers();
    return users.find(u => u.username === username) || null;
  },

  // Logic
  checkAvailability: (roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string): boolean => {
    const bookings = DataService.getBookings().filter(b => 
      b.roomId === roomId && 
      b.status !== BookingStatus.CANCELLED && 
      b.status !== BookingStatus.CHECKED_OUT &&
      b.id !== excludeBookingId
    );

    const newStart = new Date(checkIn).getTime();
    const newEnd = new Date(checkOut).getTime();

    for (const b of bookings) {
      const bStart = new Date(b.checkInDate).getTime();
      const bEnd = new Date(b.checkOutDate).getTime();
      
      // Check overlap
      if (newStart < bEnd && newEnd > bStart) {
        return false; 
      }
    }
    return true;
  }
};