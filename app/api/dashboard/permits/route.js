import { prisma } from '@/lib/prisma';

// GET - Dashboard data berdasarkan role user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return Response.json({
        success: false,
        message: 'User ID and role are required'
      }, { status: 400 });
    }

    let dashboardData = {};

    switch (role) {
      case 'PTWC':
        // PTWC melihat permits yang mereka buat
        dashboardData = await getPTWCDashboard(parseInt(userId));
        break;
      
      case 'AA':
        // AA melihat permits yang menunggu approval mereka
        dashboardData = await getAADashboard();
        break;
      
      case 'SC':
        // SC melihat permits yang sudah disetujui AA dan menunggu approval mereka
        dashboardData = await getSCDashboard();
        break;
      
      case 'ADMIN':
        // Admin melihat semua permits
        dashboardData = await getAdminDashboard();
        break;
      
      default:
        return Response.json({
          success: false,
          message: 'Invalid role'
        }, { status: 400 });
    }

    return Response.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    }, { status: 500 });
  }
}

// Dashboard untuk PTWC
async function getPTWCDashboard(userId) {
  const permits = await prisma.permitPlanning.findMany({
    where: { userId },
    include: {
      aaApprover: {
        select: { id: true, name: true, email: true }
      },
      scApprover: {
        select: { id: true, name: true, email: true }
      },
      rejector: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: permits.length,
    draft: permits.filter(p => p.status === 'DRAFT').length,
    pendingAA: permits.filter(p => p.status === 'PENDING_AA_APPROVAL').length,
    pendingSC: permits.filter(p => p.status === 'PENDING_SC_APPROVAL').length,
    fullyApproved: permits.filter(p => p.status === 'FULLY_APPROVED').length,
    active: permits.filter(p => p.status === 'ACTIVE').length,
    rejected: permits.filter(p => p.status.includes('REJECTED')).length
  };

  return {
    permits,
    stats,
    role: 'PTWC',
    title: 'PTWC Dashboard - My Permits'
  };
}

// Dashboard untuk AA
async function getAADashboard() {
  const permits = await prisma.permitPlanning.findMany({
    where: {
      status: 'PENDING_AA_APPROVAL'
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: permits.length,
    pendingApproval: permits.length
  };

  return {
    permits,
    stats,
    role: 'AA',
    title: 'AA Dashboard - Permits Awaiting My Approval'
  };
}

// Dashboard untuk SC
async function getSCDashboard() {
  const permits = await prisma.permitPlanning.findMany({
    where: {
      status: 'PENDING_SC_APPROVAL'
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      },
      aaApprover: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: permits.length,
    pendingApproval: permits.length
  };

  return {
    permits,
    stats,
    role: 'SC',
    title: 'SC Dashboard - Permits Awaiting My Approval'
  };
}

// Dashboard untuk Admin
async function getAdminDashboard() {
  const permits = await prisma.permitPlanning.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      },
      aaApprover: {
        select: { id: true, name: true, email: true }
      },
      scApprover: {
        select: { id: true, name: true, email: true }
      },
      rejector: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: permits.length,
    draft: permits.filter(p => p.status === 'DRAFT').length,
    pendingAA: permits.filter(p => p.status === 'PENDING_AA_APPROVAL').length,
    pendingSC: permits.filter(p => p.status === 'PENDING_SC_APPROVAL').length,
    fullyApproved: permits.filter(p => p.status === 'FULLY_APPROVED').length,
    active: permits.filter(p => p.status === 'ACTIVE').length,
    rejected: permits.filter(p => p.status.includes('REJECTED')).length
  };

  return {
    permits,
    stats,
    role: 'ADMIN',
    title: 'Admin Dashboard - All Permits'
  };
}
