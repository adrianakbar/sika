import { GoalModel } from '@/models/User';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const goal = await GoalModel.getGoalById(id);
    
    if (!goal) {
      return Response.json({
        success: false,
        message: 'Goal not found'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Error fetching goal:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch goal',
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, status } = body;

    // Validasi input
    if (!title) {
      return Response.json({
        success: false,
        message: 'Title is required'
      }, { status: 400 });
    }

    // Update goal
    const goal = await GoalModel.updateGoal(id, { title, description, status });
    
    return Response.json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to update goal',
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const deleted = await GoalModel.deleteGoal(id);
    
    if (!deleted) {
      return Response.json({
        success: false,
        message: 'Goal not found'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to delete goal',
      error: error.message
    }, { status: 500 });
  }
}
