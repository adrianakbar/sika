import { prisma } from '@/lib/prisma';

// GET - Mendapatkan statistik dashboard
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Base query condition
    const where = userId && userId !== 'undefined' ? { userId: parseInt(userId) } : {};
    
    // Get permit statistics
    const [
      activePermits,
      completedPermits,
      pendingApprovalPermits,
      expiredPermits,
      recentActivities,
      totalUsers
    ] = await Promise.all([
      // Active permits (APPROVED and ACTIVE status)
      prisma.permitPlanning.count({
        where: {
          ...where,
          status: { in: ['APPROVED', 'ACTIVE'] }
        }
      }),
      
      // Completed permits
      prisma.permitPlanning.count({
        where: {
          ...where,
          status: 'COMPLETED'
        }
      }),
      
      // Pending approval permits
      prisma.permitPlanning.count({
        where: {
          ...where,
          status: { in: ['SUBMITTED', 'UNDER_REVIEW'] }
        }
      }),
      
      // Expired permits (end date passed but not completed)
      prisma.permitPlanning.count({
        where: {
          ...where,
          endDate: { lt: new Date() },
          status: { notIn: ['COMPLETED', 'CANCELLED'] }
        }
      }),
      
      // Recent activities (last 10 permits with status changes)
      prisma.permitPlanning.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        include: {
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      }),
      
      // Total users count (if admin)
      userId ? null : prisma.user.count()
    ]);
    
    // Format recent activities
    const formattedActivities = recentActivities.map(permit => {
      let action, type;
      const timeAgo = getTimeAgo(permit.updatedAt);
      
      switch (permit.status) {
        case 'APPROVED':
          action = `Permit ${permit.workType || 'Work'} disetujui`;
          type = 'success';
          break;
        case 'UNDER_REVIEW':
          action = `Permit ${permit.workType || 'Work'} dalam review`;
          type = 'warning';
          break;
        case 'COMPLETED':
          action = `Permit ${permit.workType || 'Work'} selesai`;
          type = 'info';
          break;
        case 'SUBMITTED':
          action = `Permit ${permit.workType || 'Work'} diajukan`;
          type = 'default';
          break;
        case 'REJECTED':
          action = `Permit ${permit.workType || 'Work'} ditolak`;
          type = 'error';
          break;
        default:
          action = `Permit ${permit.workType || 'Work'} dibuat`;
          type = 'default';
      }
      
      return {
        action,
        time: timeAgo,
        type,
        permitNumber: permit.permitNumber,
        location: permit.workLocation
      };
    });
    
    // Prepare response data
    const stats = {
      activePermits,
      completedPermits,
      pendingApprovalPermits,
      expiredPermits,
      recentActivities: formattedActivities,
      ...(totalUsers !== null && { totalUsers })
    };
    
    return Response.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    }, { status: 500 });
  }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Baru saja';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} jam lalu`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} hari lalu`;
  }
}
