import { API_CONFIG } from '@/shared/auth/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Direct Registration Handler
 * 
 * This API route handles user registration through the backend API
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Transform to match backend UserDTO format
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.email,
      password: formData.password,
      userType: formData.userType || 'USER',
      registered: true,
      openToConnect: false
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to complete registration' },
      { status: 500 }
    );
  }
}
