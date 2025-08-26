import { prisma } from '@/lib/prisma';

// GET - Mendapatkan semua permit planning
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const zone = searchParams.get('zone');
    
    const where = {};
    if (userId && userId !== 'undefined') where.userId = parseInt(userId);
    if (status) where.status = status;
    if (zone) where.zone = zone;
    
    const permits = await prisma.permitPlanning.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return Response.json({
      success: true,
      data: permits
    });
  } catch (error) {
    console.error('Error fetching permit planning:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch permit planning',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Membuat permit planning baru
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      permitNumber,
      workDescription,
      zone, // Using zone instead of workLocation to match form
      workType,
      riskLevel,
      startDate,
      endDate,
      personalAuthority,
      company,
      areaAuthority,
      siteControllerName,
      safetyMeasures,
      relatedDocuments,
      coordinates,
      status = 'DRAFT',
      userId
    } = body;

    // Validasi input - work description, zone (work location), start date, end date, and userId are required
    if (!workDescription || !zone || !startDate || !endDate || !userId) {
      return Response.json({
        success: false,
        message: 'Work description, work location (zone), start date, end date, and userId are required'
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

    // Use permit number from request body instead of generating automatically
    if (!permitNumber || permitNumber.trim() === '') {
      return Response.json({
        success: false,
        message: 'Permit number is required'
      }, { status: 400 });
    }

    // Check if permit number already exists
    const existingPermit = await prisma.permitPlanning.findFirst({
      where: { permitNumber: permitNumber.trim() }
    });

    if (existingPermit) {
      return Response.json({
        success: false,
        message: 'Permit number already exists. Please use a different permit number.'
      }, { status: 400 });
    }

    // Parse coordinates if provided
    let coordinatesData = null;
    if (coordinates) {
      try {
        if (typeof coordinates === 'string') {
          // Handle different coordinate formats
          if (coordinates.includes(';')) {
            const [x, y] = coordinates.split(';');
            coordinatesData = JSON.stringify({ x: parseFloat(x), y: parseFloat(y) });
          } else if (coordinates.includes(',')) {
            const [x, y] = coordinates.split(',');
            coordinatesData = JSON.stringify({ x: parseFloat(x), y: parseFloat(y) });
          } else {
            coordinatesData = coordinates;
          }
        } else {
          coordinatesData = JSON.stringify(coordinates);
        }
      } catch (error) {
        coordinatesData = String(coordinates);
      }
    }

    // Buat permit planning baru
    const permit = await prisma.permitPlanning.create({
      data: {
        permitNumber,
        workDescription: workDescription.trim(),
        workLocation: zone, // Use zone as work location
        coordinates: coordinatesData,
        zone: zone,
        workType: workType || null,
        riskLevel: riskLevel || 'LOW',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        personalAuthority: personalAuthority || null,
        company: company || null,
        areaAuthority: areaAuthority || null,
        siteControllerName: siteControllerName || null,
        safetyMeasures: safetyMeasures || null,
        relatedDocuments: relatedDocuments ? JSON.stringify(relatedDocuments) : null,
        status: status || 'DRAFT',
        userId: parseInt(userId)
      },
      include: {
        user: {
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
      message: 'Permit planning created successfully',
      data: permit
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating permit planning:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to create permit planning',
      error: error.message
    }, { status: 500 });
  }
}
