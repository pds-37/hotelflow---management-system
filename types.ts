export enum RoomStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  MAINTENANCE = 'Maintenance',
  CLEANING = 'Cleaning'
}

export enum RoomType {
  SINGLE = 'Single',
  DOUBLE = 'Double',
  SUITE = 'Suite',
  DELUXE = 'Deluxe'
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  price: number;
  capacity: number;
  status: RoomStatus;
}

export interface Guest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idProof: string;
  createdAt: string;
}

export enum BookingStatus {
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'Checked In',
  CHECKED_OUT = 'Checked Out',
  CANCELLED = 'Cancelled'
}

export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkInDate: string; // ISO Date string YYYY-MM-DD
  checkOutDate: string; // ISO Date string YYYY-MM-DD
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'UPI'
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}

export enum UserRole {
  ADMIN = 'Admin',
  STAFF = 'Staff'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}