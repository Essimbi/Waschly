import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export type Role = 'client' | 'washer' | 'admin' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  // State management using Angular Signals (Mocked for development)
  currentUser = signal<User | null>({ id: 'dev-mock-user', email: 'dev@waschly.local' } as User);
  currentSession = signal<Session | null>(null);
  userRole = signal<Role>('client'); // Force client role to test features/client

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    // Initial session check
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.updateState(session);
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.updateState(session);
    });
  }

  private updateState(session: Session | null) {
    // DEV MODE: Ignore Supabase session failure since we use a dummy URL
    // Keep the mocked signals intact.
    /*
    this.currentSession.set(session);
    this.currentUser.set(session?.user ?? null);
    
    if (session?.user) {
      const metadataRole = session.user.user_metadata?.['role'] as Role;
      this.userRole.set(metadataRole || 'client');
    } else {
      this.userRole.set(null);
    }
    */
  }

  async signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }
}
