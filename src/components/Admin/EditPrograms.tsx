'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { updateProgram } from "@/actions/onProgramInfo";
import { toast } from "sonner";
import { Program } from "./ProgramsGrid";
import clsx from "clsx";

export type ProgramDetails = {
    id: string;
    name: string;
    description?: string;
    mode?: string;
    duration?: string;
    category?: string;
    fees?: string;
    createdAt?: Date;
    updatedAt?: Date;
    coOpInternship?: string;
    college?: string;
    curriculum?: string;
    location?: string;
    publicPrivate?: string;
    ranking?: string;
    specialLocationFeatures?: string;
    specialUniversityFeatures?: string;
    specialization?: string;
    university: string;
    usp?: string;
    eligibility: any;
    applicationFee?: string;
    deposit?: string;
    depositRefundableVisa?: string;
    interviews?: string;
    keyCompaniesHiring?: string;
    keyJobRoles?: string;
    lor?: string;
    quantQualitative?: string;
    sop?: string;
    transcriptEvaluation?: string;
}

interface EditProgramProps {
    program: Program | ProgramDetails;
    isOpen: boolean;
    onClose: () => void;
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-2">{children}</div>
);

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            variant={"outline"}
            type="submit"
            className="w-full mt-6 text-black"
            disabled={pending}
        >
            {pending ? (
                <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                </span>
            ) : (
                "Update Program"
            )}
        </Button>
    );
}

const EditProgram = ({ program, isOpen, onClose }: EditProgramProps) => {
    const router = useRouter();
    const [formErrors, setFormErrors] = React.useState<{ [key: string]: string }>({});

    const validateNumber = (value: string | null, fieldName: string) => {
        if (!value || value === '' || value === 'Not Specified') return '';
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            return `${fieldName} must be a positive number`;
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (['fees', 'applicationFee', 'deposit', 'ranking'].includes(name)) {
            const error = validateNumber(value, name);
            setFormErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    async function handleFormAction(formData: FormData) {
        // Validate all numerical fields before submission
        const numericalFields = ['fees', 'applicationFee', 'deposit', 'ranking'];
        const errors: { [key: string]: string } = {};

        numericalFields.forEach(field => {
            const value = formData.get(field) as string;
            if (value && value !== 'Not Specified') {
                const error = validateNumber(value, field);
                if (error) errors[field] = error;
            }
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error('Please fix the form errors before submitting');
            return;
        }

        try {
            console.log("Submitting form data:", Object.fromEntries(formData));
            
            const result = await updateProgram(program.id, formData);
            
            if (result.success) {
                toast.success('Program updated successfully!');
                onClose();
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to update program');
            }
        } catch (error) {
            console.error('Error updating program:', error);
            toast.error('Failed to update program');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] rounded-md bg-[#151723] text-white border-2 border-[#2D2D2D] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Program</DialogTitle>
                    <DialogDescription>
                        Update program details.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleFormAction} className="flex-grow overflow-auto">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Basic Information Column */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-300">Basic Information</h2>
                            
                            <LabelInputContainer>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    defaultValue={program.name}
                                    placeholder="Enter program name"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                />
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="fees">Fees</Label>
                                <Input
                                    id="fees"
                                    name="fees"
                                    defaultValue={(program as ProgramDetails)?.fees || "Not Specified"}
                                    placeholder="Program fees"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    onChange={handleInputChange}
                                />
                                {formErrors.fees && <span className="text-red-500 text-sm">{formErrors.fees}</span>}
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="applicationFee">Application Fee</Label>
                                <Input
                                    id="applicationFee"
                                    name="applicationFee"
                                    defaultValue={(program as ProgramDetails)?.applicationFee || "Not Specified"}
                                    placeholder="Application fee"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    onChange={handleInputChange}
                                />
                                {formErrors.applicationFee && <span className="text-red-500 text-sm">{formErrors.applicationFee}</span>}
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="deposit">Deposit</Label>
                                <Input
                                    id="deposit"
                                    name="deposit"
                                    defaultValue={(program as ProgramDetails)?.deposit || "Not Specified"}
                                    placeholder="Deposit amount"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    onChange={handleInputChange}
                                />
                                {formErrors.deposit && <span className="text-red-500 text-sm">{formErrors.deposit}</span>}
                            </LabelInputContainer>
                        </div>

                        {/* Additional Information Column */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-300">Additional Information</h2>
                            
                            <LabelInputContainer>
                                <Label htmlFor="university">University</Label>
                                <Input
                                    id="university"
                                    name="university"
                                    defaultValue={(program as ProgramDetails)?.university || ""}
                                    placeholder="University name"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                />
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="college">College</Label>
                                <Input
                                    id="college"
                                    name="college"
                                    defaultValue={(program as ProgramDetails)?.college || ""}
                                    placeholder="College name"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                />
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    defaultValue={(program as ProgramDetails)?.location || ""}
                                    placeholder="Program location"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                />
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="specialization">Specialization</Label>
                                <Input
                                    id="specialization"
                                    name="specialization"
                                    defaultValue={(program as ProgramDetails)?.specialization || ""}
                                    placeholder="Program specialization"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                />
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="usp">USP</Label>
                                <Input
                                    id="usp"
                                    name="usp"
                                    defaultValue={(program as ProgramDetails)?.usp || ""}
                                    placeholder="Program USP"
                                    className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                />
                            </LabelInputContainer>
                        </div>

                        {/* Application Requirements */}
                        <div className="col-span-2 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-300">Application Requirements</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <LabelInputContainer>
                                    <Label htmlFor="applicationFee">Application Fee</Label>
                                    <Input
                                        id="applicationFee"
                                        name="applicationFee"
                                        type="number"
                                        defaultValue={(program as ProgramDetails)?.applicationFee || ""}
                                        placeholder="Application fee"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.applicationFee && <span className="text-red-500 text-sm">{formErrors.applicationFee}</span>}
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="deposit">Deposit</Label>
                                    <Input
                                        id="deposit"
                                        name="deposit"
                                        type="number"
                                        defaultValue={(program as ProgramDetails)?.deposit || ""}
                                        placeholder="Deposit amount"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.deposit && <span className="text-red-500 text-sm">{formErrors.deposit}</span>}
                                </LabelInputContainer>
                            </div>
                        </div>
                    </div>

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProgram;
