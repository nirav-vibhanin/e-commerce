import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'user' | 'admin';
      token: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    token: string;
  }
} 