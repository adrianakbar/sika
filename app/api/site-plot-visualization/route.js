import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get('zone');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    
    // Get only ACTIVE permit planning data for visualization (approved by both AA and CC)
    const permitPlannings = await prisma.permitPlanning.findMany({
      where: {
        status: 'ACTIVE', // Hanya tampilkan permit yang sudah fully approved
        ...(zone && { zone }),
        ...(userId && { userId: parseInt(userId) })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        aaApprover: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        ccApprover: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Process coordinates for both datasets
    const processCoordinates = (item) => {
      let coordinates = null;
      
      if (item.coordinates) {
        try {
          coordinates = JSON.parse(item.coordinates);
        } catch (error) {
          // If not JSON, try to parse as string
          if (typeof item.coordinates === 'string') {
            if (item.coordinates.includes(';')) {
              const [x, y] = item.coordinates.split(';');
              coordinates = { x: parseFloat(x), y: parseFloat(y) };
            } else if (item.coordinates.includes(',')) {
              const [x, y] = item.coordinates.split(',');
              coordinates = { x: parseFloat(x), y: parseFloat(y) };
            } else {
              coordinates = { raw: item.coordinates };
            }
          }
        }
      }

      return {
        ...item,
        parsedCoordinates: coordinates,
        type: 'permit'
      };
    };

    const processedPermits = permitPlannings.map(processCoordinates);

    // Group by zone for easier visualization
    const groupedByZone = processedPermits.reduce((acc, point) => {
      const zoneKey = point.zone || 'UNKNOWN';
      if (!acc[zoneKey]) {
        acc[zoneKey] = {
          zone: zoneKey,
          permits: [],
          total: 0
        };
      }
      
      acc[zoneKey].permits.push(point);
      acc[zoneKey].total = acc[zoneKey].permits.length;
      
      return acc;
    }, {});

    // Zone definitions with colors for visualization
    const zoneDefinitions = {
      'PRC': { name: 'Processing/Production Area', color: '#ff3f33', description: 'Area produksi utama' },
      'UTL': { name: 'Utilities Area', color: '#9fc87e', description: 'Area utilitas dan distribusi' },
      'BLD': { name: 'Building/Office Area', color: '#ffe6e1', description: 'Area perkantoran dan bangunan' },
      'GMS': { name: 'Gas Metering Station', color: '#075b5e', description: 'Stasiun pengukur gas' },
      'CCR': { name: 'Central Control Room', color: '#ff3f33', description: 'Ruang kontrol pusat' },
      'OY': { name: 'Open Yard', color: '#9fc87e', description: 'Area terbuka dan penyimpanan' },
      'NBL': { name: 'New Building/Laboratory', color: '#075b5e', description: 'Laboratorium dan bangunan baru' },
      'WS': { name: 'Workshop/Warehouse', color: '#ff3f33', description: 'Workshop dan gudang' }
    };

    return Response.json({
      success: true,
      data: {
        allPoints: processedPermits,
        byZone: groupedByZone,
        statistics: {
          totalPermits: processedPermits.length,
          totalPoints: processedPermits.length,
          zoneCount: Object.keys(groupedByZone).length
        },
        zoneDefinitions
      }
    });
  } catch (error) {
    console.error('Error fetching site plot visualization:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch site plot visualization',
      error: error.message
    }, { status: 500 });
  }
}
