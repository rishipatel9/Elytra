'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProgramCard from './ProgramCard';


export type Program = {
    name: string;
    description: string;
    mode: string;
    duration: string;
    category: string;
    fees: string;
    eligibility: string;
};

const ProgramsGrid = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axios.get('/api/programs');
                setPrograms(response.data.programs); // Assuming the response has a 'programs' key
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    return (
        <>
            <div className="w-full h-10 text-white py-4">
                Programs
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2">
                {isLoading ? (
                    <div className="text-white">Loading Programs...</div>
                ) : (
                    programs.map((program) => (
                        <ProgramCard key={program.name} program={program} />
                    ))
                )}
            </div>
        </>
    );
};

export default ProgramsGrid;
