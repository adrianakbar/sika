import { GoalModel } from '@/models/User';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const goals = await GoalModel.getAllGoals(userId);
    
    return Response.json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to fetch goals',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, status, userId } = body;

    // Validasi input
    if (!title || !userId) {
      return Response.json({
        success: false,
        message: 'Title and userId are required'
      }, { status: 400 });
    }

    // Buat goal baru
    const goal = await GoalModel.createGoal({ 
      title, 
      description, 
      status: status || 'PENDING', 
      userId 
    });
    
    return Response.json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    
    return Response.json({
      success: false,
      message: 'Failed to create goal',
      error: error.message
    }, { status: 500 });
  }
}
