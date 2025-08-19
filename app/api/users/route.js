import { UserModel } from '@/models/User';

export async function GET() {
  try {
    const users = await UserModel.getAllUsers();
    
    return Response.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validasi input
    if (!name || !email || !password) {
      return Response.json({
        success: false,
        message: 'Name, email, and password are required'
      }, { status: 400 });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return Response.json({
        success: false,
        message: 'Email already registered'
      }, { status: 409 });
    }

    // Buat user baru
    const user = await UserModel.createUser({ name, email, password, role });
    
    return Response.json({
      success: true,
      message: 'User created successfully',
      data: user
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    }, { status: 500 });
  }
}
