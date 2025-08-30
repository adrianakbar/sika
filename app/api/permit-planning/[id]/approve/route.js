import { prisma } from '@/lib/prisma';

// POST - Approve permit by AA or CC
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { userId, role, comments } = body;

    // Validasi input
    if (!userId || !role) {
      return Response.json({
        success: false,
        message: 'User ID and role are required'
      }, { status: 400 });
    }

    // Validasi user exists dan memiliki role yang tepat
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    if (!['AA', 'SC'].includes(role) || user.role !== role) {
      return Response.json({
        success: false,
        message: 'Invalid role or user does not have permission to approve'
      }, { status: 403 });
    }

    // Dapatkan permit yang akan di-approve
    const permit = await prisma.permitPlanning.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        aaApprover: true,
        scApprover: true
      }
    });

    if (!permit) {
      return Response.json({
        success: false,
        message: 'Permit not found'
      }, { status: 404 });
    }

    // Logika approval berdasarkan role
    let updateData = {};
    let newStatus = permit.status;

    if (role === 'AA') {
      // AA approval
      if (!['SUBMITTED', 'PENDING_AA_APPROVAL'].includes(permit.status)) {
        return Response.json({
          success: false,
          message: 'Permit is not in a state that can be approved by AA'
        }, { status: 400 });
      }

      updateData = {
        aaApprovedBy: parseInt(userId),
        aaApprovedAt: new Date(),
        aaComments: comments || null,
        status: 'AA_APPROVED'
      };
      newStatus = 'AA_APPROVED';

    } else if (role === 'SC') {
      // SC approval - hanya bisa approve jika sudah disetujui AA
      if (permit.status !== 'AA_APPROVED') {
        return Response.json({
          success: false,
          message: 'Permit must be approved by AA first before SC can approve'
        }, { status: 400 });
      }

      updateData = {
        scApprovedBy: parseInt(userId),
        scApprovedAt: new Date(),
        scComments: comments || null,
        status: 'FULLY_APPROVED'
      };
      newStatus = 'FULLY_APPROVED';
    }

    // Update permit
    const updatedPermit = await prisma.permitPlanning.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        aaApprover: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        scApprover: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Jika sudah fully approved, ubah status ke ACTIVE agar muncul di site plot
    if (newStatus === 'FULLY_APPROVED') {
      await prisma.permitPlanning.update({
        where: { id: parseInt(id) },
        data: { status: 'ACTIVE' }
      });
      
      updatedPermit.status = 'ACTIVE';
    }

    return Response.json({
      success: true,
      message: `Permit approved by ${role}${newStatus === 'FULLY_APPROVED' ? ' and is now active' : ''}`,
      data: updatedPermit
    });

  } catch (error) {
    console.error('Error approving permit:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to approve permit',
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Reject permit by AA or CC
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { userId, role, rejectionReason } = body;

    // Validasi input
    if (!userId || !role || !rejectionReason) {
      return Response.json({
        success: false,
        message: 'User ID, role, and rejection reason are required'
      }, { status: 400 });
    }

    // Validasi user exists dan memiliki role yang tepat
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    if (!['AA', 'SC'].includes(role) || user.role !== role) {
      return Response.json({
        success: false,
        message: 'Invalid role or user does not have permission to reject'
      }, { status: 403 });
    }

    // Dapatkan permit yang akan di-reject
    const permit = await prisma.permitPlanning.findUnique({
      where: { id: parseInt(id) }
    });

    if (!permit) {
      return Response.json({
        success: false,
        message: 'Permit not found'
      }, { status: 404 });
    }

    // Tentukan status rejection berdasarkan role
    let newStatus = role === 'AA' ? 'REJECTED_BY_AA' : 'REJECTED_BY_SC';

    // Update permit dengan rejection
    const updatedPermit = await prisma.permitPlanning.update({
      where: { id: parseInt(id) },
      data: {
        status: newStatus,
        rejectedBy: parseInt(userId),
        rejectedAt: new Date(),
        rejectionReason: rejectionReason
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        rejector: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return Response.json({
      success: true,
      message: `Permit rejected by ${role}`,
      data: updatedPermit
    });

  } catch (error) {
    console.error('Error rejecting permit:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to reject permit',
      error: error.message
    }, { status: 500 });
  }
}
