import { User } from '../types';
import { getJSON, setJSON, removeItem } from './storage';

export interface Account {
  id: string;
  userId: string;
  email: string;
  password: string;
}

export const mockAccounts: Account[] = [
  { id: 'a1', userId: '3', email: 'admin@company.com', password: 'admin123' },
  { id: 'a2', userId: '1', email: 'ram.sharma@company.com', password: 'driver123' },
  { id: 'a3', userId: '2', email: 'abhay.patel@company.com', password: 'driver123' },
  { id: 'a4', userId: '4', email: 'operator@company.com', password: 'operator123' },
];

// Mock users for authentication (since we don't have a users table yet)
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'राम शर्मा',
    email: 'ram.sharma@company.com',
    role: 'driver',
    phone: '+91 9876543210',
    truckAssigned: 'MH12AB1234'
  },
  {
    id: '2',
    name: 'अभय पटेल',
    email: 'abhay.patel@company.com',
    role: 'driver',
    phone: '+91 9876543211',
    truckAssigned: 'MH14CD5678'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    phone: '+91 9876543212'
  },
  {
    id: '4',
    name: 'Operator User',
    email: 'operator@company.com',
    role: 'operator',
    phone: '+91 9876543213'
  }
];

const AUTH_KEY = 'auth_user';

export function signIn(identifier: string, password: string): User | null {
  const acct = mockAccounts.find(a => a.email.toLowerCase() === identifier.toLowerCase());
  if (!acct) return null;
  if (acct.password !== password) return null;
  const user = mockUsers.find(u => u.id === acct.userId) || null;
  if (user) {
    setJSON<User>(AUTH_KEY, user);
  }
  return user || null;
}

export function getCurrentUser(): User | null {
  return getJSON<User>(AUTH_KEY);
}

export function signOut() {
  removeItem(AUTH_KEY);
}


