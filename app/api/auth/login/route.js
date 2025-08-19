import { AuthModel, UserModel } from '@/models/User';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return Response.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }

    // Autentikasi user
    const user = await AuthModel.authenticateUser(email, password);
    
    if (!user) {
      return Response.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Update last login
    await AuthModel.updateLastLogin(user.id);

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    
    return Response.json({
      success: false,
      message: 'Login failed',
      error: error.message
    }, { status: 500 });
  }
}
