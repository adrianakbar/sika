import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test query untuk memeriksa koneksi dengan Prisma
    const userCount = await prisma.user.count();
    
    return Response.json({
      success: true,
      message: 'Database connection successful with Prisma',
      data: {
        userCount,
        database: 'MySQL with Prisma ORM',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return Response.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;
    
    // Contoh create user dengan Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: 'temp123', // In real app, hash this password
        role: 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    return Response.json({
      success: true,
      message: 'User created successfully with Prisma',
      data: user
    });
  } catch (error) {
    console.error('Database create error:', error);
    
    return Response.json({
      success: false,
      message: 'Database create failed',
      error: error.message
    }, { status: 500 });
  }
}
