import { NextRequest } from 'next/server';
import { JWT } from 'next-auth/jwt';

declare module 'next/server' {
  interface NextRequest {
    nextauth: {
      token: JWT | null;
    };
  }
} 