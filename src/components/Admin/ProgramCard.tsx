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
    const [isExpanded, setIsExpanded] = useState(false);


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
        <Card className="w-full border rounded-xl overflow-hidden bg-background dark:bg-[#212A39] hover:border-[rgb(128,50,255)] hover:border-2 dark:border-[#3B4254] border-[#E9ECF1] shadow-sm transition-all duration-300 font-sans">
      <CardContent className="p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold text-[#222939] dark:text-white">{program.name}</h3>
            <p className="text-sm text-gray-500 dark:text-[#8F8F8F]">{program.university}</p>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4 text-gray-700 dark:text-[#8F8F8F]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-[#222939] dark:text-white border dark:border-[#3B4254] border-[#E9ECF1] dark:bg-[#212A39]">
              <DropdownMenuItem className="cursor-pointer hover:bg-[#2D2D2D] flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#2D2D2D] text-red-500 flex items-center gap-2">
                <Trash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Program Details */}
        <div className="space-y-2 text-gray-700 dark:text-[#8F8F8F]">
          <p>
            <span className="font-medium text-[#222939] dark:text-white">Location:</span> {program.location || 'N/A'}
          </p>
          <p>
            <span className="font-medium text-[#222939] dark:text-white">Ranking:</span> {program.ranking || 'N/A'}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-white">Deposit:</span> {program.deposit || 'N/A'}
          </p>

          {/* Expandable Content */}
          <div className="text-sm">
            {isExpanded ? (
              <>
                <p>
                  <span className="font-medium text-[#222939] dark:text-white">Specialization:</span>
                  {Array.isArray(program.specialization) && program.specialization.length > 0 ? (
                    <ul className="list-disc list-inside mt-1">
                      {program.specialization.map((spec, index) => (
                        <li key={index}>{spec}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>N/A</span>
                  )}
                </p>

                <p>
                  <span className="font-medium text-[#222939] dark:text-white">Eligibility:</span>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {eligibility.ugBackground && (
                      <li>
                        <strong>UG Background:</strong> {eligibility.ugBackground.replace("\\n", ", ")}
                      </li>
                    )}
                    {eligibility.minimumGpa && (
                      <li>
                        <strong>Minimum GPA:</strong> {eligibility.minimumGpa}
                      </li>
                    )}
                    {eligibility.backlogs !== undefined && (
                      <li>
                        <strong>Backlogs:</strong> {eligibility.backlogs}
                      </li>
                    )}
                    {eligibility.workExperience && (
                      <li>
                        <strong>Work Experience:</strong> {eligibility.workExperience}
                      </li>
                    )}
                    {eligibility.allow3YearDegree && (
                      <li>
                        <strong>Allow 3-Year Degree:</strong> {eligibility.allow3YearDegree}
                      </li>
                    )}
                  </ul>
                </p>
              </>
            ) : (
              <p className="line-clamp-2">
                <span className="font-medium text-[#222939] dark:text-white">Specialization:</span>{" "}
                {Array.isArray(program.specialization) && program.specialization.length > 0
                  ? program.specialization.join(", ")
                  : "N/A"}
              </p>
            )}
            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:underline mt-1"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>

      </>
  

    );
};

export default ProgramCard;