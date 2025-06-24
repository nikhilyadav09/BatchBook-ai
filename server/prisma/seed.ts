// server/prisma/seed.ts
import { PrismaClient, UserRole, BatchMemberRole, MemoryCategory, MemoryStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.memory.deleteMany();
  await prisma.batchInvitation.deleteMany();
  await prisma.batchMember.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@university.edu',
        name: 'John Doe',
        bio: 'Computer Science student passionate about AI and web development.',
        dateOfBirth: new Date('1999-05-15'),
        isVerified: true,
        role: UserRole.USER,
        achievements: [
          { title: 'Dean\'s List', year: '2023' },
          { title: 'Coding Competition Winner', year: '2023' }
        ]
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@university.edu',
        name: 'Jane Smith',
        bio: 'Engineering student and photography enthusiast.',
        dateOfBirth: new Date('1999-08-22'),
        isVerified: true,
        role: UserRole.USER,
        achievements: [
          { title: 'Best Project Award', year: '2023' },
          { title: 'Photography Contest Winner', year: '2022' }
        ]
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin@batchbook.com',
        name: 'Admin User',
        bio: 'Platform administrator.',
        isVerified: true,
        role: UserRole.ADMIN,
        achievements: []
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike.wilson@university.edu',
        name: 'Mike Wilson',
        bio: 'Business student and sports enthusiast.',
        dateOfBirth: new Date('1999-12-10'),
        isVerified: true,
        role: UserRole.USER,
        achievements: [
          { title: 'Team Captain', year: '2023' },
          { title: 'Student Leader', year: '2022' }
        ]
      }
    })
  ]);

  console.log('✅ Created users');

  // Create demo batches
  const batches = await Promise.all([
    prisma.batch.create({
      data: {
        name: 'Computer Science 2024',
        academicYear: '2020-2024',
        institution: 'State University',
        description: 'CS Batch of 2024 - Building the future with code!',
        settings: {
          allowGuestPosts: false,
          moderationRequired: true,
          publiclyVisible: true
        },
        isPrivate: false
      }
    }),
    prisma.batch.create({
      data: {
        name: 'Engineering 2024',
        academicYear: '2020-2024',
        institution: 'Technical Institute',
        description: 'Engineering minds creating tomorrow\'s solutions.',
        settings: {
          allowGuestPosts: true,
          moderationRequired: false,
          publiclyVisible: true
        },
        isPrivate: false
      }
    }),
    prisma.batch.create({
      data: {
        name: 'Business Administration 2024',
        academicYear: '2020-2024',
        institution: 'Business School',
        description: 'Future leaders and entrepreneurs.',
        settings: {
          allowGuestPosts: false,
          moderationRequired: true,
          publiclyVisible: false
        },
        isPrivate: true
      }
    })
  ]);

  console.log('✅ Created batches');

  // Create batch memberships
  const memberships = await Promise.all([
    // John Doe memberships
    prisma.batchMember.create({
      data: {
        userId: users[0].id,
        batchId: batches[0].id,
        role: BatchMemberRole.ADMIN
      }
    }),
    prisma.batchMember.create({
      data: {
        userId: users[0].id,
        batchId: batches[1].id,
        role: BatchMemberRole.MEMBER
      }
    }),
    // Jane Smith memberships
    prisma.batchMember.create({
      data: {
        userId: users[1].id,
        batchId: batches[0].id,
        role: BatchMemberRole.MODERATOR
      }
    }),
    prisma.batchMember.create({
      data: {
        userId: users[1].id,
        batchId: batches[1].id,
        role: BatchMemberRole.ADMIN
      }
    }),
    // Mike Wilson memberships
    prisma.batchMember.create({
      data: {
        userId: users[3].id,
        batchId: batches[2].id,
        role: BatchMemberRole.ADMIN
      }
    }),
    prisma.batchMember.create({
      data: {
        userId: users[3].id,
        batchId: batches[0].id,
        role: BatchMemberRole.MEMBER
      }
    })
  ]);

  console.log('✅ Created batch memberships');

  // Create demo memories
  const memories = await Promise.all([
    prisma.memory.create({
      data: {
        title: 'First Day of College',
        description: 'Remember when we were all nervous freshmen? Time flies!',
        category: MemoryCategory.ACADEMIC,
        status: MemoryStatus.PUBLISHED,
        tags: ['freshman', 'nervous', 'firstday', 'college'],
        aiCaption: 'A group of excited students on their first day of college',
        mediaUrls: ['https://via.placeholder.com/600x400?text=First+Day'],
        authorId: users[0].id,
        batchId: batches[0].id,
        viewCount: 45,
        metadata: {
          location: 'Main Campus',
          event: 'Orientation Day'
        }
      }
    }),
    prisma.memory.create({
      data: {
        title: 'Hackathon Winners',
        description: 'Our team won the annual hackathon! 48 hours of coding and pizza.',
        category: MemoryCategory.ACHIEVEMENT,
        status: MemoryStatus.PUBLISHED,
        tags: ['hackathon', 'coding', 'teamwork', 'winner'],
        aiCaption: 'Team celebrating their hackathon victory with trophy',
        mediaUrls: [
          'https://via.placeholder.com/600x400?text=Hackathon+Trophy',
          'https://via.placeholder.com/600x400?text=Team+Photo'
        ],
        authorId: users[1].id,
        batchId: batches[0].id,
        viewCount: 78,
        metadata: {
          event: 'Annual Hackathon 2023',
          prize: 'First Place'
        }
      }
    }),
    prisma.memory.create({
      data: {
        title: 'Study Group Sessions',
        description: 'Late night study sessions in the library during finals week.',
        category: MemoryCategory.ACADEMIC,
        status: MemoryStatus.PUBLISHED,
        tags: ['study', 'finals', 'library', 'latenight'],
        aiCaption: 'Students studying together in the library',
        mediaUrls: ['https://via.placeholder.com/600x400?text=Study+Group'],
        authorId: users[0].id,
        batchId: batches[0].id,
        viewCount: 32,
        metadata: {
          location: 'University Library',
          subject: 'Data Structures'
        }
      }
    }),
    prisma.memory.create({
      data: {
        title: 'Cultural Fest Performance',
        description: 'Amazing performance by our batch at the annual cultural festival.',
        category: MemoryCategory.CULTURAL,
        status: MemoryStatus.PUBLISHED,
        tags: ['cultural', 'performance', 'festival', 'dance'],
        aiCaption: 'Students performing on stage at cultural festival',
        mediaUrls: ['https://via.placeholder.com/600x400?text=Cultural+Performance'],
        authorId: users[1].id,
        batchId: batches[1].id,
        viewCount: 156,
        metadata: {
          event: 'Annual Cultural Fest',
          performance: 'Traditional Dance'
        }
      }
    }),
    prisma.memory.create({
      data: {
        title: 'Sports Championship',
        description: 'Our basketball team made it to the finals! What a season.',
        category: MemoryCategory.SPORTS,
        status: MemoryStatus.PUBLISHED,
        tags: ['basketball', 'championship', 'sports', 'team'],
        aiCaption: 'Basketball team celebrating after winning championship',
        mediaUrls: ['https://via.placeholder.com/600x400?text=Basketball+Champions'],
        authorId: users[3].id,
        batchId: batches[2].id,
        viewCount: 89,
        metadata: {
          sport: 'Basketball',
          achievement: 'Finals'
        }
      }
    })
  ]);

  console.log('✅ Created memories');

  // Create demo comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'This brings back so many memories! I still remember how nervous I was.',
        authorId: users[1].id,
        memoryId: memories[0].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Best team ever! Those 48 hours were intense but so worth it.',
        authorId: users[0].id,
        memoryId: memories[1].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'I lived in that library during finals week 😅',
        authorId: users[1].id,
        memoryId: memories[2].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'What an amazing performance! You guys nailed it.',
        authorId: users[0].id,
        memoryId: memories[3].id
      }
    })
  ]);

  console.log('✅ Created comments');

  // Create demo reactions
  const reactions = await Promise.all([
    prisma.reaction.create({
      data: {
        type: 'LIKE',
        userId: users[1].id,
        memoryId: memories[0].id
      }
    }),
    prisma.reaction.create({
      data: {
        type: 'LOVE',
        userId: users[0].id,
        memoryId: memories[1].id
      }
    }),
    prisma.reaction.create({
      data: {
        type: 'LAUGH',
        userId: users[3].id,
        memoryId: memories[2].id
      }
    }),
    prisma.reaction.create({
      data: {
        type: 'WOW',
        userId: users[0].id,
        memoryId: memories[3].id
      }
    })
  ]);

  console.log('✅ Created reactions');

  // Create demo notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        type: 'NEW_COMMENT',
        title: 'New Comment',
        message: 'Jane Smith commented on your memory "First Day of College"',
        userId: users[0].id,
        data: {
          memoryId: memories[0].id,
          commentId: comments[0].id
        }
      }
    }),
    prisma.notification.create({
      data: {
        type: 'NEW_REACTION',
        title: 'New Reaction',
        message: 'John Doe loved your memory "Hackathon Winners"',
        userId: users[1].id,
        data: {
          memoryId: memories[1].id,
          reactionType: 'LOVE'
        }
      }
    })
  ]);

  console.log('✅ Created notifications');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`
  📊 Summary:
  - Users: ${users.length}
  - Batches: ${batches.length}
  - Batch Members: ${memberships.length}
  - Memories: ${memories.length}
  - Comments: ${comments.length}
  - Reactions: ${reactions.length}
  - Notifications: ${notifications.length}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });