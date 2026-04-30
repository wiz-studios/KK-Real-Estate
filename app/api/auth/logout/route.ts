import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear auth cookies
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      maxAge: 0
    });

    response.cookies.set('user_role', '', {
      httpOnly: false,
      maxAge: 0
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
