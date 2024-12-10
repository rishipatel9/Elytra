import prisma from '@/lib/prisma';

let cache = {
  data: {},
  timestamp: 0,
};

const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  try {
    const currentTime = Date.now();

    if (cache.data && currentTime - cache.timestamp < CACHE_TTL) {
      console.log('Using cached data');
      return new Response(JSON.stringify({ success: true, data: cache.data }), { status: 200 });
    }
    console.log('Fetching fresh data from the database');
    const totalUsers = await prisma.user.count();

    const usersWithApplications = await prisma.user.count({
      where: {
        filledApplication: true,
      },
    });

    const programsByCategory = await prisma.program.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
    });

    const topPrograms = await prisma.program.findMany({
      orderBy: {
        ranking: 'asc',
      },
      take: 5,
      select: {
        name: true,
        university: true,
        ranking: true,
      },
    });

    const recentChats = await prisma.chat.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
    });

    const activeSessions = await prisma.session.count();
    cache = {
      data: {
        totalUsers,
        usersWithApplications,
        programsByCategory,
        topPrograms,
        recentChats,
        activeSessions,
      },
      timestamp: currentTime,
    };

    return new Response(
      JSON.stringify({ success: true, data: cache.data }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch admin dashboard data' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
