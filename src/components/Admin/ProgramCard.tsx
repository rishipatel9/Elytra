import { Program } from "./ProgramsGrid";

const ProgramCard = ({ program }: { program: Program }) => {
    // Parse the eligibility JSON string
    const eligibility = program.eligibility
        ? JSON.parse(program.eligibility as unknown as string)
        : null;
        

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[250px]">
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
