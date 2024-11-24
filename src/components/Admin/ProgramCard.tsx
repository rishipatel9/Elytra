import { Program } from "./ProgramsGrid";


const ProgramCard = ({ program }: { program: Program }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">{program.name}</h3>
            <p className="text-gray-400 mb-2">{program.description}</p>
            <div className="text-white">
                <div><strong>Mode:</strong> {program.mode}</div>
                <div><strong>Duration:</strong> {program.duration}</div>
                <div><strong>Category:</strong> {program.category}</div>
                <div><strong>Fees:</strong> {program.fees}</div>
                <div><strong>Eligibility:</strong> {program.eligibility}</div>
            </div>
        </div>
    );
};

export default ProgramCard;
