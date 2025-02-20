import { KEYCLOAK_CONFIG, KEYCLOAK_ENDPOINTS } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This API route handles user registration via admin API
 * Required because registration is disabled in Keycloak realm settings
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the registration data from the request
    const userData = await request.json();
    
    // Try direct registration first if available
    try {
      const userId = await tryAdminRegistration(userData);
      return NextResponse.json({
        success: true,
        message: 'User registered successfully',
        userId: userId
      });
    } catch (adminError) {
      console.error('Admin registration failed:', adminError);
      return NextResponse.json(
        { error: `Registration failed: ${adminError.message}` },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

/**
 * Try to register a user directly using Keycloak's public registration endpoint
 */
async function tryDirectRegistration(userData: any): Promise<void> {
  const registrationEndpoint = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/registrations`;
  
  // Prepare registration data in Keycloak format
  const registrationData = {
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    enabled: true,
    emailVerified: true,
    credentials: [
      {
        type: 'password',
        value: userData.password,
        temporary: false
      }
    ],
    attributes: {
      phoneNumber: userData.phoneNumber ? [userData.phoneNumber] : undefined,
      userType: userData.userType ? [userData.userType] : ['GENERAL_USER'],
      ...(userData.additionalInfo || {})
    }
  };
  
  // Add client ID - this is required for some Keycloak configurations
  registrationData['clientId'] = KEYCLOAK_CONFIG.CLIENT_ID;
  if (KEYCLOAK_CONFIG.CLIENT_SECRET) {
    registrationData['clientSecret'] = KEYCLOAK_CONFIG.CLIENT_SECRET;
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(registrationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMsg = '';
      try {
        const errorData = await response.json();
        errorMsg = errorData.errorMessage || errorData.error || `Status ${response.status}`;
      } catch {
        errorMsg = `Status ${response.status}`;
      }
      throw new Error(`Direct registration failed: ${errorMsg}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Try to register a user using admin API
 * Returns userId if successful
 */
async function tryAdminRegistration(userData: any): Promise<string | undefined> {
  // Get admin token
  const adminToken = await getAdminToken();
  if (!adminToken) {
    throw new Error('Failed to obtain admin token');
  }
  
  // Determine appropriate group path based on userType
  let groupPath = '/General Users';
  let userRoles = ['USER'];
  
  switch(userData.userType) {
    case 'MANAGER':
      groupPath = '/Pharmacy Staff/Managers';
      userRoles = ['MANAGER', 'USER'];
      break;
    case 'PHARMACIST':
      groupPath = '/Pharmacy Staff/Pharmacists';
      userRoles = ['PHARMACIST', 'USER'];
      break;
    case 'PROPRIETOR':
      groupPath = '/Pharmacy Staff/Proprietors';
      userRoles = ['PROPRIETOR', 'USER'];
      break;
    case 'SALESMAN':
      groupPath = '/Pharmacy Staff/Salespeople';
      userRoles = ['SALESMAN', 'USER'];
      break;
    case 'INSTRUCTOR':
      groupPath = '/Education/Instructors';
      userRoles = ['INSTRUCTOR', 'USER'];
      break;
    case 'STUDENT':
      groupPath = '/Education/Students';
      userRoles = ['USER'];
      break;
    case 'ADMIN':
      groupPath = '/System Administration/Administrators';
      userRoles = ['ADMIN', 'USER'];
      break;
    case 'SUPER_ADMIN':
      groupPath = '/System Administration/Super Administrators';
      userRoles = ['SUPER_ADMIN', 'ADMIN', 'USER'];
      break;
    default:
      groupPath = '/General Users';
      userRoles = ['USER'];
  }
  
  // Prepare user data for admin API
  const adminUserData = {
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    enabled: true,
    emailVerified: true,
    credentials: [
      {
        type: 'password',
        value: userData.password,
        temporary: false
      }
    ],
    attributes: {
      phoneNumber: userData.phoneNumber ? [userData.phoneNumber] : undefined,
      userType: [userData.userType || 'GENERAL_USER'],
      ...(userData.additionalInfo || {})
    },
    groups: [groupPath],
    realmRoles: userRoles
  };
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(KEYCLOAK_ENDPOINTS.ADMIN_USERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(adminUserData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMsg = '';
      try {
        const errorData = await response.json();
        errorMsg = errorData.errorMessage || errorData.error || `Status ${response.status}`;
      } catch {
        errorMsg = `Status ${response.status}`;
      }
      throw new Error(`Admin registration failed: ${errorMsg}`);
    }
    
    // Get user ID from location header
    const locationHeader = response.headers.get('Location');
    return locationHeader?.split('/').pop();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Get admin token using client credentials
 */
async function getAdminToken(): Promise<string | null> {
  // Try several auth methods in sequence
  return await getTokenViaClientCredentials() || 
         await getTokenViaPassword();
}

/**
 * Get token via client credentials
 */
async function getTokenViaClientCredentials(): Promise<string | null> {
  try {
    const tokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`;
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
    formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    
    if (!response.ok) return null;
    
    const tokenData = await response.json();
    return tokenData.access_token || null;
  } catch (error) {
    console.warn('Client credentials auth failed:', error);
    return null;
  }
}

/**
 * Get token via password credentials
 */
async function getTokenViaPassword(): Promise<string | null> {
  // Try both master realm and regular realm
  return await getMasterRealmToken() || await getRealmToken();
}

/**
 * Get token from master realm
 */
async function getMasterRealmToken(): Promise<string | null> {
  try {
    const tokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/master/protocol/openid-connect/token`;
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', 'admin-cli');
    formData.append('username', KEYCLOAK_CONFIG.ADMIN_USERNAME);
    formData.append('password', KEYCLOAK_CONFIG.ADMIN_PASSWORD);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Master realm auth failed: ${response.status}`);
        return null;
      }
      
      const tokenData = await response.json();
      return tokenData.access_token || null;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Master realm auth network error:', error);
      return null;
    }
  } catch (error) {
    console.warn('Master realm auth failed:', error);
    return null;
  }
}

/**
 * Get token from regular realm
 */
async function getRealmToken(): Promise<string | null> {
  try {
    const tokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`;
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
    formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
    formData.append('username', KEYCLOAK_CONFIG.REALM_ADMIN_USERNAME);
    formData.append('password', KEYCLOAK_CONFIG.REALM_ADMIN_PASSWORD);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Realm auth failed: ${response.status}`);
        return null;
      }
      
      const tokenData = await response.json();
      return tokenData.access_token || null;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Realm auth network error:', error);
      return null;
    }
  } catch (error) {
    console.warn('Realm auth failed:', error);
    return null;
  }
}
