'use server'

import prisma from '@/lib/prisma'; 

export async function checkStudentApplicationFilled(userId: string): Promise<boolean> {
  try {
    const application = await prisma.user.findUnique({
      where: {id: userId },
      select: { filledApplication: true }
    });

    return !!application?.filledApplication;
  } catch (error) {
    console.error('Error checking student application:', error);
    return false;
  }
}