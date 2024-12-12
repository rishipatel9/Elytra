'use server'

import prisma from '@/lib/prisma'; 

export async function checkStudentApplicationFilled(email: string): Promise<boolean> {
  try {
    const application = await prisma.user.findUnique({
      where: {email: email },
      select: { filledApplication: true }
    });

    return application?.filledApplication ?? false;
  } catch (error) {
    console.error('Error checking student application:', error);
    return false;
  }
}