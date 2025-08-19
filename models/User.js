import { prisma } from '@/lib/prisma';

export class UserModel {
  // Mendapatkan semua users
  static async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        // Exclude password from selection
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // Mendapatkan user berdasarkan ID
  static async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      }
    });
  }

  // Mendapatkan user berdasarkan email
  static async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      }
    });
  }

  // Mendapatkan user dengan password (untuk authentication)
  static async getUserByEmailWithPassword(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  // Membuat user baru
  static async createUser(userData) {
    const { name, email, password, role = 'USER' } = userData;
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    
    return user;
  }

  // Update user
  static async updateUser(id, userData) {
    const { name, email } = userData;
    
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      }
    });
  }

  // Hapus user
  static async deleteUser(id) {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    
    return !!deletedUser;
  }

  // Get user with relations
  static async getUserWithRelations(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        goals: {
          orderBy: { createdAt: 'desc' }
        },
        siteplotplans: {
          orderBy: { createdAt: 'desc' }
        },
        organizationStructures: {
          include: {
            parent: true,
            children: true
          }
        }
      }
    });
  }
}

export class AuthModel {
  // Login user
  static async authenticateUser(email, password) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Update last login
  static async updateLastLogin(userId) {
    return await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        lastLogin: new Date()
      }
    });
  }
}

export class GoalModel {
  // Get all goals
  static async getAllGoals(userId = null) {
    const where = userId ? { userId: parseInt(userId) } : {};
    
    return await prisma.goal.findMany({
      where,
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
  }

  // Get goal by ID
  static async getGoalById(id) {
    return await prisma.goal.findUnique({
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
  }

  // Create goal
  static async createGoal(goalData) {
    const { title, description, status = 'PENDING', userId } = goalData;
    
    return await prisma.goal.create({
      data: {
        title,
        description,
        status,
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
  }

  // Update goal
  static async updateGoal(id, goalData) {
    const { title, description, status } = goalData;
    
    return await prisma.goal.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        status
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
  }

  // Delete goal
  static async deleteGoal(id) {
    const deletedGoal = await prisma.goal.delete({
      where: { id: parseInt(id) }
    });
    
    return !!deletedGoal;
  }
}
