import prisma from "@/lib/prisma";

export  async function GET(){
    try{
        const users=await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
                plan: true,
                name: true,
            },
        });
        console.log(users)
        return new Response(JSON.stringify({ success: true, data: users }), { status: 200 });
    }catch(error){
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ success: false, error: 'Error fetching data' }), { status: 500 });
    }
}