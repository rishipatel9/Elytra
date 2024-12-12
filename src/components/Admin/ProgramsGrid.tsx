'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProgramCard from './ProgramCard';

export type Program = {
    id: string;
    name: string;
    university: string;
    specialization: string[]; 
    usp: string[];
    ranking: string;
    location: string;
    deposit?: string; 
    eligibility: {
        ugBackground: string[];
    };
};

const ProgramsGrid = ({ searchQuery }: { searchQuery: string }) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get('/api/programs');
            console.log(response)
            const formattedPrograms = response.data.programs.map((program: any) => ({
                ...program,
                specialization: Array.isArray(program.specialization)
                    ? program.specialization
                    : [program.specialization || "N/A"], // Ensure array
                usp: Array.isArray(program.usp) ? program.usp : [program.usp || "N/A"], // Ensure array
                eligibility: program.eligibility || { ugBackground: [] },
                deposit: program.deposit || "Not Specified",
            }));
            setPrograms(formattedPrograms);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();

        // Listen for program updates
        const handleProgramUpdate = () => {
            fetchPrograms();
        };

        window.addEventListener('programUpdated', handleProgramUpdate);

        return () => {
            window.removeEventListener('programUpdated', handleProgramUpdate);
        };
    }, []);

    const handleDelete = (id: string) => {
        setPrograms(programs.filter(program => program.id !== id));
        fetchPrograms(); // Refresh programs after delete
    };

    const handleEdit = (program: Program) => {
        setSelectedProgram(program);
        // You can implement a modal or navigation to edit form here
        fetchPrograms(); // Refresh programs after edit
    };

    const filteredPrograms = programs.filter(program => 
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.specialization.some(spec => 
            spec.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 py-2">
                {isLoading ? (
                    // <div className="text-[#EDEDED] text-lg">Loading Programs...</div>
                    Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                      ))
                ) : (
                    filteredPrograms.map((program, index) => (
                        <ProgramCard 
                            key={program.id || index} 
                            program={program} 
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProgramsGrid;

const SkeletonCard = () => (
    <div className="animate-pulse border rounded-xl overflow-hidden bg-white dark:bg-[#212A39] dark:border-[#3B4254] border-[#E9ECF1] shadow-lg">
      {/* Card Header Skeleton */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 mt-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
  
      {/* Card Body Skeleton */}
      <div className="space-y-4 px-6 pb-6">
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );