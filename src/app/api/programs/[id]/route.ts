import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
        }
        await prisma.program.delete({
            where: {
            id
            },
        });
        return NextResponse.json({ message: 'Program deleted successfully' });
    } catch (error) {
        console.error('Error deleting program:', error);
        return NextResponse.json(
            { error: 'Error deleting program' },
            { status: 500 }
        );
    }
}