import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      roles: string[];
      permissions: string[];
    }
  }

  interface User {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  }
}
