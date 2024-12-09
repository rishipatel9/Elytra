import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Program } from './ProgramsGrid';
import { toast } from 'sonner';
import EditProgram from './EditPrograms';
import axios from "axios";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProgramCardProps {
    program: Program;
    onDelete: (id: string) => void;
    onEdit: (program: Program) => void;
}

const ProgramCard = ({ program, onDelete, onEdit }: ProgramCardProps) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/programs/${program.id}`);
            onDelete(program.id);
            toast.success('Program deleted successfully');
        } catch (error) {
            console.error('Error deleting program:', error);
            toast.error('Failed to delete program');
        }
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
        onEdit(program);
    };

    // Parse the eligibility JSON string
    const eligibility = program.eligibility
        ? JSON.parse(program.eligibility as unknown as string)
        : null;

    return (
        <>
            <Card className="w-full bg-[#151723] border-2 border-[#2D2D2D] rounded-lg overflow-hidden hover:border-[#3D3D3D] transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{program.name}</h3>
                            <p className="text-[#8F8F8F] text-sm">{program.university}</p>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4 text-white" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1c1e2d] text-white border-[#2D2D2D]">
                                    <DropdownMenuItem 
                                        onClick={handleEdit}
                                        className="cursor-pointer hover:bg-[#2D2D2D] flex items-center gap-2"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={handleDelete}
                                        className="cursor-pointer hover:bg-[#2D2D2D] text-red-500 flex items-center gap-2"
                                    >
                                        <Trash className="h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[#8F8F8F]">
                            <span className="font-medium text-white">Location:</span> {program.location || 'N/A'}
                        </p>
                        <p className="text-[#8F8F8F]">
                            <span className="font-medium text-white">Specialization:</span> {Array.isArray(program.specialization) && program.specialization.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {program.specialization.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span>N/A</span>
                            )}
                        </p>
                        <p className="text-[#8F8F8F]">
                            <span className="font-medium text-white">Ranking:</span> {program.ranking || 'N/A'}
                        </p>
                        <p className="text-[#8F8F8F]">
                            <span className="font-medium text-white">Deposit:</span> {program.deposit || 'N/A'}
                        </p>
                        <p className="text-[#8F8F8F]">
                            <span className="font-medium text-white">Eligibility:</span>
                            {eligibility ? (
                                <ul className="list-disc list-inside">
                                    {eligibility.ugBackground && <li><strong>UG Background:</strong> {eligibility.ugBackground}</li>}
                                    {eligibility.minimumGpa && <li><strong>Minimum GPA:</strong> {eligibility.minimumGpa}</li>}
                                    {eligibility.backlogs !== undefined && <li><strong>Backlogs:</strong> {eligibility.backlogs}</li>}
                                    {eligibility.workExperience && <li><strong>Work Experience:</strong> {eligibility.workExperience}</li>}
                                    {eligibility.allow3YearDegree && (
                                        <li>
                                            <strong>Allow 3-Year Degree:</strong> {eligibility.allow3YearDegree}
                                        </li>
                                    )}
                                </ul>
                            ) : (
                                <span>N/A</span>
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <EditProgram
                program={program}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    );
};

export default ProgramCard;