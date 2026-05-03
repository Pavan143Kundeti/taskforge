import { PrismaClient, Role, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@taskforge.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  });

  const john = await prisma.user.create({
    data: {
      email: 'john@taskforge.com',
      password: hashedPassword,
      name: 'John Doe',
      role: Role.MEMBER,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah@taskforge.com',
      password: hashedPassword,
      name: 'Sarah Wilson',
      role: Role.MEMBER,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  });

  const mike = await prisma.user.create({
    data: {
      email: 'mike@taskforge.com',
      password: hashedPassword,
      name: 'Mike Chen',
      role: Role.MEMBER,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
  });

  console.log('✅ Users created');

  // Create projects
  const webAppProject = await prisma.project.create({
    data: {
      name: 'Web Application Redesign',
      description: 'Complete redesign of the company web application with modern UI/UX',
      color: '#6366f1',
      ownerId: admin.id,
    },
  });

  const mobileProject = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build native mobile apps for iOS and Android',
      color: '#8b5cf6',
      ownerId: admin.id,
    },
  });

  const apiProject = await prisma.project.create({
    data: {
      name: 'API Integration',
      description: 'Integrate third-party APIs and build internal microservices',
      color: '#ec4899',
      ownerId: john.id,
    },
  });

  console.log('✅ Projects created');

  // Add team members
  await prisma.teamMember.createMany({
    data: [
      { projectId: webAppProject.id, userId: john.id, role: Role.MEMBER },
      { projectId: webAppProject.id, userId: sarah.id, role: Role.MEMBER },
      { projectId: mobileProject.id, userId: mike.id, role: Role.MEMBER },
      { projectId: mobileProject.id, userId: sarah.id, role: Role.MEMBER },
      { projectId: apiProject.id, userId: admin.id, role: Role.ADMIN },
      { projectId: apiProject.id, userId: mike.id, role: Role.MEMBER },
    ],
  });

  console.log('✅ Team members added');

  // Create tasks for Web App Project
  const tasks = [
    {
      title: 'Design new landing page',
      description: 'Create mockups and prototypes for the new landing page',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      projectId: webAppProject.id,
      assigneeId: sarah.id,
      creatorId: admin.id,
      dueDate: new Date('2026-04-15'),
    },
    {
      title: 'Implement authentication flow',
      description: 'Build secure login and registration with JWT',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      projectId: webAppProject.id,
      assigneeId: john.id,
      creatorId: admin.id,
      dueDate: new Date('2026-05-10'),
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: webAppProject.id,
      assigneeId: john.id,
      creatorId: admin.id,
      dueDate: new Date('2026-05-20'),
    },
    {
      title: 'Optimize database queries',
      description: 'Improve performance by optimizing slow queries',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: webAppProject.id,
      assigneeId: null,
      creatorId: admin.id,
      dueDate: new Date('2026-06-01'),
    },
    {
      title: 'Write API documentation',
      description: 'Document all API endpoints with examples',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      projectId: webAppProject.id,
      assigneeId: sarah.id,
      creatorId: admin.id,
      dueDate: new Date('2026-05-15'),
    },
  ];

  // Create tasks for Mobile Project
  const mobileTasks = [
    {
      title: 'Setup React Native project',
      description: 'Initialize project with proper folder structure',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      projectId: mobileProject.id,
      assigneeId: mike.id,
      creatorId: admin.id,
      dueDate: new Date('2026-04-20'),
    },
    {
      title: 'Build user profile screen',
      description: 'Create profile screen with edit functionality',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      projectId: mobileProject.id,
      assigneeId: sarah.id,
      creatorId: admin.id,
      dueDate: new Date('2026-05-12'),
    },
    {
      title: 'Implement push notifications',
      description: 'Setup Firebase Cloud Messaging for notifications',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      projectId: mobileProject.id,
      assigneeId: mike.id,
      creatorId: admin.id,
      dueDate: new Date('2026-05-25'),
    },
  ];

  // Create tasks for API Project
  const apiTasks = [
    {
      title: 'Design REST API architecture',
      description: 'Plan API structure and endpoints',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.URGENT,
      projectId: apiProject.id,
      assigneeId: john.id,
      creatorId: john.id,
      dueDate: new Date('2026-04-10'),
    },
    {
      title: 'Integrate payment gateway',
      description: 'Add Stripe payment processing',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: apiProject.id,
      assigneeId: mike.id,
      creatorId: john.id,
      dueDate: new Date('2026-05-08'),
    },
    {
      title: 'Setup monitoring and logging',
      description: 'Implement error tracking and performance monitoring',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: apiProject.id,
      assigneeId: null,
      creatorId: john.id,
      dueDate: new Date('2026-05-30'),
    },
  ];

  await prisma.task.createMany({
    data: [...tasks, ...mobileTasks, ...apiTasks],
  });

  console.log('✅ Tasks created');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Test accounts:');
  console.log('Admin: admin@taskforge.com / password123');
  console.log('John: john@taskforge.com / password123');
  console.log('Sarah: sarah@taskforge.com / password123');
  console.log('Mike: mike@taskforge.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
