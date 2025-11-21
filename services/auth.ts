import { User } from '../types';

const USERS_KEY = 'novabill_users_db';
const SESSION_KEY = 'novabill_current_session';

export const AuthService = {
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  register: (email: string, password: string, shopName: string): { success: boolean; message?: string; user?: User } => {
    const users = AuthService.getUsers();
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      email,
      password, // In production, hash this!
      shopName
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login after register
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  login: (email: string, password: string): { success: boolean; message?: string; user?: User } => {
    const users = AuthService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const { password, ...userWithoutPass } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPass));
      return { success: true, user: userWithoutPass as User };
    }

    return { success: false, message: 'Invalid credentials' };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};