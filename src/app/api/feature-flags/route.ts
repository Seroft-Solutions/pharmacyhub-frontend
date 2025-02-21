import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Private feature flags configuration - stored server-side
const FEATURE_FLAGS = {
  LICENSING_ENABLED: process.env.LICENSING_ENABLED === 'false',
  MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true',
} as const;

// User-specific or role-based feature flags
const getRoleBasedFlags = (userRoles: string[] = []) => {
  const flags: Record<string, boolean> = {};
  
  // Example: Enable licensing only for specific roles
  flags.LICENSING_ENABLED = FEATURE_FLAGS.LICENSING_ENABLED && (
    userRoles.some(role => ['ADMIN', 'PHARMACIST', 'MANAGER'].includes(role))
  );

  return flags;
};

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Get user roles from session
    const userRoles = session?.user?.roles || [];
    
    // Get role-based feature flags
    const flags = getRoleBasedFlags(userRoles);

    // Return only the necessary flags for this user
    return NextResponse.json(flags, { status: 200 });
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' }, 
      { status: 500 }
    );
  }
}