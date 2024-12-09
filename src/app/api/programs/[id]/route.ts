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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
        }

        const data = await request.json();
        const program = await prisma.program.update({
            where: { id },
            data: {
                name: data.name,
                university: data.university,
                specialization: data.specialization,
                usp: data.usp,
                ranking: data.ranking,
                location: data.location,
                deposit: data.deposit,
                eligibility: data.eligibility
            }
        });

        return NextResponse.json({ message: 'Program updated successfully', program });
    } catch (error) {
        console.error('Error updating program:', error);
        return NextResponse.json(
            { error: 'Error updating program' },
            { status: 500 }
        );
    }
}
