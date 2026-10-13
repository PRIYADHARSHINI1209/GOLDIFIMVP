import { User, UserRole } from '@/types';
import { DEMO_USERS } from '@/mock/users';

class AuthService {
  private currentUser: User = DEMO_USERS.OWNER;
  private isAuthenticated: boolean = true;

  async getCurrentUser(): Promise<User | null> {
    return this.isAuthenticated ? { ...this.currentUser } : null;
  }

  async login(email: string, _shopCode: string): Promise<{ success: boolean; user: User }> {
    // Find matching demo user or default to owner
    const matchedRole = Object.keys(DEMO_USERS).find(
      (key) => DEMO_USERS[key].email.toLowerCase() === email.toLowerCase()
    );

    const user = matchedRole ? DEMO_USERS[matchedRole] : DEMO_USERS.OWNER;
    this.currentUser = { ...user };
    this.isAuthenticated = true;
    return { success: true, user: this.currentUser };
  }

  async verifyOtp(_otp: string): Promise<boolean> {
    this.isAuthenticated = true;
    return true;
  }

  async switchRole(role: UserRole): Promise<User> {
    if (DEMO_USERS[role]) {
      this.currentUser = { ...DEMO_USERS[role] };
      this.isAuthenticated = true;
    }
    return { ...this.currentUser };
  }

  async logout(): Promise<void> {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}

export const mockAuthService = new AuthService();
