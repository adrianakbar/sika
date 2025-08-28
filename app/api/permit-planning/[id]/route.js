import { prisma } from '@/lib/prisma';

// GET - Mendapatkan permit planning berdasarkan ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const permit = await prisma.permitPlanning.findUnique({
      where: { id: parseInt(id) },
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
    
    if (!permit) {
      return Response.json({
        success: false,
        message: 'Permit not found'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      data: permit
    });
  } catch (error) {
    console.error('Error fetching permit:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch permit',
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Update permit planning
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if permit exists
    const existingPermit = await prisma.permitPlanning.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingPermit) {
      return Response.json({
        success: false,
        message: 'Permit not found'
      }, { status: 404 });
    }

    // Check if permit number is being changed and if the new permit number already exists
    if (body.permitNumber && body.permitNumber !== existingPermit.permitNumber) {
      const permitWithSameNumber = await prisma.permitPlanning.findFirst({
        where: { 
          permitNumber: body.permitNumber,
          id: { not: parseInt(id) } // Exclude current permit from check
        }
      });
      
      if (permitWithSameNumber) {
        return Response.json({
          success: false,
          message: 'Permit number already exists. Please use a different permit number.'
        }, { status: 400 });
      }
    }
    
    // Update permit
    const updatedPermit = await prisma.permitPlanning.update({
      where: { id: parseInt(id) },
      data: {
        permitNumber: body.permitNumber,
        workDescription: body.workDescription,
        workLocation: body.workLocation || body.zone, // fallback to zone if workLocation not provided
        workType: body.workType,
        zone: body.zone,
        riskLevel: body.riskLevel,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        performingAuthority: body.performingAuthority,
        company: body.company,
        areaAuthority: body.areaAuthority,
        siteControllerName: body.siteControllerName,
        safetyMeasures: body.safetyMeasures,
        ppeRequired: body.equipmentNeeded || body.ppeRequired,
        emergencyContact: body.emergencyProcedure || body.emergencyContact,
        relatedDocuments: body.relatedDocuments ? JSON.stringify(body.relatedDocuments) : null,
        coordinates: body.coordinates ? (typeof body.coordinates === 'string' ? body.coordinates : JSON.stringify(body.coordinates)) : null,
        status: body.status || existingPermit.status,
        updatedAt: new Date()
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
      message: 'Permit updated successfully',
      data: updatedPermit
    });
  } catch (error) {
    console.error('Error updating permit:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to update permit',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Hapus permit planning
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Check if permit exists
    const existingPermit = await prisma.permitPlanning.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingPermit) {
      return Response.json({
        success: false,
        message: 'Permit not found'
      }, { status: 404 });
    }
    
    // Check if permit can be deleted (optional: add business logic here)
    if (existingPermit.status === 'ACTIVE') {
      return Response.json({
        success: false,
        message: 'Cannot delete active permit. Please change status first.'
      }, { status: 400 });
    }
    
    // Delete permit
    await prisma.permitPlanning.delete({
      where: { id: parseInt(id) }
    });
    
    return Response.json({
      success: true,
      message: 'Permit deleted successfully'
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
