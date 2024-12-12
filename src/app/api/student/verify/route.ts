import prisma from "@/lib/prisma";
import { getUserDetails } from "@/utils";

export async function GET() {
    try{
        const session= await getUserDetails();

        if(!session){
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
        }

        const { email } = session.user;

        const user = await prisma.user.findUnique({ where: { email }, select: { filledApplication: true } });

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
    }catch(e){
        console.error('Error fetching data:', e);
        return new Response(JSON.stringify({ success: false, error: 'Error fetching data' }), { status: 500 });
    }
}