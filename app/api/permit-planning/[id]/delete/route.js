import { prisma } from '@/lib/prisma';

// DELETE - Delete permit (hanya PTWC owner atau ADMIN)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // Validasi input
    if (!userId) {
      return Response.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    // Validasi user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Dapatkan permit
    const permit = await prisma.permitPlanning.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true
      }
    });

    if (!permit) {
      return Response.json({
        success: false,
        message: 'Permit not found'
      }, { status: 404 });
    }

    // Hanya permit owner (PTWC) atau admin yang bisa delete
    if (permit.userId !== parseInt(userId) && user.role !== 'ADMIN') {
      return Response.json({
        success: false,
        message: 'You can only delete your own permits'
      }, { status: 403 });
    }

    // Hanya PTWC atau ADMIN yang bisa delete permit
    if (user.role !== 'PTWC' && user.role !== 'ADMIN') {
      return Response.json({
        success: false,
        message: 'Only PTWC can delete permits'
      }, { status: 403 });
    }

    // Delete permit
    await prisma.permitPlanning.delete({
      where: { id: parseInt(id) }
    });

    return Response.json({
      success: true,
      message: 'Permit deleted successfully',
      data: { id: parseInt(id) }
    });

  } catch (error) {
    console.error('Error deleting permit:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to delete permit',
      error: error.message
    }, { status: 500 });
  }
}
