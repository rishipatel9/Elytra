'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProgramCard from './ProgramCard';

export type Program = {
    name: string;
    university: string;
    specialization: string[]; // Must be an array
    usp: string[];
    ranking: string;
    location: string;
    deposit?: string; // Optional
    eligibility: {
        ugBackground: string[];
    };
};

const ProgramsGrid = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // useEffect(() => {
    //     const fetchPrograms = async () => {
    //         try {
    //             const response = await axios.get('/api/programs');
    //             const formattedPrograms = response.data.programs.map((program: any) => ({
    //                 ...program,
    //                 specialization: Array.isArray(program.specialization)
    //                     ? program.specialization
    //                     : [program.specialization || "N/A"], // Ensure array
    //                 usp: Array.isArray(program.usp) ? program.usp : [program.usp || "N/A"], // Ensure array
    //                 eligibility: program.eligibility || { ugBackground: [] },
    //                 deposit: program.deposit || "Not Specified",
    //             }));
    //             setPrograms(formattedPrograms);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error(error);
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchPrograms();
    // }, []);

    return (
        <>
            <div className="w-full h-10 text-[#EDEDED] py-4 text-xl font-bold">Programs</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2">
                {isLoading ? (
                    <div className="text-[#EDEDED] text-lg">Loading Programs...</div>
                ) : (
                    programs.map((program, idx) => (
                        <ProgramCard key={idx} program={program} />
                    ))
                )}
            </div>
        </>
    );
};

export default ProgramsGrid;
