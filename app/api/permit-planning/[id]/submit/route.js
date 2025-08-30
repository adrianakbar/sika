import { prisma } from '@/lib/prisma';

// POST - Submit permit untuk approval (hanya PTWC)
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { userId } = body;

    // Validasi input
    if (!userId) {
      return Response.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    // Validasi user exists dan role PTWC
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    if (user.role !== 'PTWC' && user.role !== 'ADMIN') {
      return Response.json({
        success: false,
        message: 'Only PTWC can submit permits for approval'
      }, { status: 403 });
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

    // Hanya permit owner atau admin yang bisa submit
    if (permit.userId !== parseInt(userId) && user.role !== 'ADMIN') {
      return Response.json({
        success: false,
        message: 'You can only submit your own permits'
      }, { status: 403 });
    }

    // Hanya permit dengan status DRAFT yang bisa di-submit
    if (permit.status !== 'DRAFT') {
      return Response.json({
        success: false,
        message: 'Only draft permits can be submitted'
      }, { status: 400 });
    }

    // Update status ke PENDING_AA_APPROVAL
    const updatedPermit = await prisma.permitPlanning.update({
      where: { id: parseInt(id) },
      data: {
        status: 'PENDING_AA_APPROVAL'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return Response.json({
      success: true,
      message: 'Permit submitted for AA approval',
      data: updatedPermit
    });

  } catch (error) {
    console.error('Error submitting permit:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to submit permit',
      error: error.message
    }, { status: 500 });
  }
}
