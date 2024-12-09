import { Program } from "./ProgramsGrid";
import { useState } from "react";
import axios from "axios";

interface ProgramCardProps {
    program: Program;
    onDelete: (id: string) => void;
    onEdit: (program: Program) => void;
}

const ProgramCard = ({ program, onDelete, onEdit }: ProgramCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    // Parse the eligibility JSON string
    const eligibility = program.eligibility
        ? JSON.parse(program.eligibility as unknown as string)
        : null;

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/programs/${program.id}`);
            onDelete(program.id);
        } catch (error) {
            console.error('Error deleting program:', error);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[250px] relative">
            {/* Three-dot menu */}
            <div className="absolute top-4 right-4">
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-gray-400 hover:text-white focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
                
                {/* Dropdown menu */}
                {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu">
                            <button
                                onClick={() => {
                                    onEdit(program);
                                    setShowMenu(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                                role="menuitem"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete();
                                    setShowMenu(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                                role="menuitem"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold text-white mb-2 truncate">{program.name}</h3>
                <p className="text-gray-400 mb-4">{program.university}</p>

                <div className="text-gray-300 text-sm space-y-2">
                    <div>
                        <strong>Specialization:</strong>
                        {Array.isArray(program.specialization) && program.specialization.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {program.specialization.map((spec, index) => (
                                    <li key={index}>{spec}</li>
                                ))}
                            </ul>
                        ) : (
                            <span>Not Specified</span>
                        )}
                    </div>
                    <div><strong>Location:</strong> {program.location || "Not Specified"}</div>
                    <div><strong>Ranking:</strong> {program.ranking || "Not Ranked"}</div>
                    <div><strong>Deposit:</strong> {program.deposit || "Not Mentioned"}</div>
                    <div>
                        <strong>Eligibility:</strong>
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
                            <span>Not Specified</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramCard;