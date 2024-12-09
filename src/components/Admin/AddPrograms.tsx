'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { createProgram, updateProgram } from "@/actions/onProgramInfo";
import { toast } from "sonner";
import { Program } from "./ProgramsGrid";
import clsx from "clsx";

// Full program details type
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
    canFinishIn?: string;
    creditsInIITIIM?: string;
    creditsInUS?: string;
    gloveraPricing?: string;
    iitIim?: string;
    originalPricing?: string;
    savings?: string;
    savingsPercentage?: string;
    totalCredits?: string;
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

interface AddProgramProps {
    program?: Program | ProgramDetails;
    isOpen: boolean;
    onClose: () => void;
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-2">{children}</div>
);

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button
            variant={"outline"}
            type="submit"
            className="bg-white text-black w-full py-3 text-lg col-span-2 mt-4"
            disabled={pending}
        >
            {pending ? (
                <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                </span>
            ) : (
                isEditing ? "Update Program" : "Create Program"
            )}
        </Button>
    );
}

const AddProgram = ({ program, isOpen, onClose }: AddProgramProps) => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState<{ [key: string]: string }>({});
    const isEditing = !!program;

    React.useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setIsDialogOpen(false);
        onClose();
    };

    const validateNumber = (value: string, fieldName: string) => {
        if (value === '') return '';
        const num = Number(value);
        if (isNaN(num)) return `${fieldName} must be a number`;
        if (num < 0) return `${fieldName} cannot be negative`;
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
        const numericalFields = ['fees', 'applicationFee', 'deposit', 'ranking'];
        const errors: { [key: string]: string } = {};

        numericalFields.forEach(field => {
            const value = formData.get(field) as string;
            if (value) {
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
            let result;
            if (isEditing && program) {
                result = await updateProgram(program.id, formData);
            } else {
                result = await createProgram(formData);
            }

            if (result.success) {
                toast.success(isEditing ? 'Program updated successfully!' : 'Program created successfully!');
                handleClose();
                router.refresh();
            } else {
                toast.error(result.error || `Failed to ${isEditing ? 'update' : 'create'} program`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} program:`, error);
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} program`);
        }
    }

    return (
        <div className={clsx({ 'blur-background': isDialogOpen })}>
            <Dialog open={isDialogOpen} onOpenChange={handleClose}>
                <DialogTrigger asChild>
                    {!isEditing && (
                        <Button className="flex items-center px-6 py-3 md:px-8 bg-white text-[#2D2D2D] font-medium rounded-md hover:bg-[#f0f0f0] h-[2.5rem]">
                            <span className="h-5 w-5 md:hidden">
                                <PlusIcon />
                            </span>
                            <span className="hidden md:inline">Create</span>
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] rounded-md bg-[#151723] text-white border-2 border-[#2D2D2D] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Program' : 'Create New Program'}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update program details.' : 'Enter the details for your new program.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form action={handleFormAction} className="flex-grow overflow-auto">
                        <div className="grid grid-cols-2 gap-6 pr-4">
                            {/* Basic Information Column */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-300">Basic Information</h2>
                                <LabelInputContainer>
                                    <Label htmlFor="name">Program Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        defaultValue={program?.name}
                                        placeholder="Enter program name"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        defaultValue={(program as ProgramDetails)?.description || ""}
                                        placeholder="Program description"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="mode">Mode</Label>
                                    <Input
                                        id="mode"
                                        name="mode"
                                        defaultValue={(program as ProgramDetails)?.mode || ""}
                                        placeholder="Program mode"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        defaultValue={(program as ProgramDetails)?.duration || ""}
                                        placeholder="Program duration"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        defaultValue={(program as ProgramDetails)?.category || ""}
                                        placeholder="Program category"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="fees">Fees</Label>
                                    <Input
                                        id="fees"
                                        name="fees"
                                        type="number"
                                        defaultValue={(program as ProgramDetails)?.fees || ""}
                                        placeholder="Program fees"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.fees && <span className="text-red-500 text-sm">{formErrors.fees}</span>}
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
                                    <Label htmlFor="publicPrivate">Public/Private</Label>
                                    <Input
                                        id="publicPrivate"
                                        name="publicPrivate"
                                        defaultValue={(program as ProgramDetails)?.publicPrivate || ""}
                                        placeholder="Public or Private"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="specialLocationFeatures">Special Location Features</Label>
                                    <Input
                                        id="specialLocationFeatures"
                                        name="specialLocationFeatures"
                                        defaultValue={(program as ProgramDetails)?.specialLocationFeatures || ""}
                                        placeholder="Special location features"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="specialUniversityFeatures">Special University Features</Label>
                                    <Input
                                        id="specialUniversityFeatures"
                                        name="specialUniversityFeatures"
                                        defaultValue={(program as ProgramDetails)?.specialUniversityFeatures || ""}
                                        placeholder="Special university features"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>
                        </div>

                        {/* Additional Fields */}
                        <div className="mt-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-300">Program Details</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
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

                                <LabelInputContainer>
                                    <Label htmlFor="curriculum">Curriculum</Label>
                                    <Input
                                        id="curriculum"
                                        name="curriculum"
                                        defaultValue={(program as ProgramDetails)?.curriculum || ""}
                                        placeholder="Program curriculum"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="coOpInternship">Co-op/Internship</Label>
                                    <Input
                                        id="coOpInternship"
                                        name="coOpInternship"
                                        defaultValue={(program as ProgramDetails)?.coOpInternship || ""}
                                        placeholder="Co-op/Internship details"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-300 mt-6">Application Requirements</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <LabelInputContainer>
                                    <Label htmlFor="transcriptEvaluation">Transcript Evaluation</Label>
                                    <Input
                                        id="transcriptEvaluation"
                                        name="transcriptEvaluation"
                                        defaultValue={(program as ProgramDetails)?.transcriptEvaluation || ""}
                                        placeholder="Transcript evaluation details"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="lor">LOR</Label>
                                    <Input
                                        id="lor"
                                        name="lor"
                                        defaultValue={(program as ProgramDetails)?.lor || ""}
                                        placeholder="LOR requirements"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="sop">SOP</Label>
                                    <Input
                                        id="sop"
                                        name="sop"
                                        defaultValue={(program as ProgramDetails)?.sop || ""}
                                        placeholder="SOP requirements"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="interviews">Interviews</Label>
                                    <Input
                                        id="interviews"
                                        name="interviews"
                                        defaultValue={(program as ProgramDetails)?.interviews || ""}
                                        placeholder="Interview requirements"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-300 mt-6">Fees & Deposits</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <LabelInputContainer>
                                    <Label htmlFor="applicationFee">Application Fee</Label>
                                    <Input
                                        id="applicationFee"
                                        name="applicationFee"
                                        type="number"
                                        defaultValue={(program as ProgramDetails)?.applicationFee || ""}
                                        placeholder="Application fee amount"
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

                                <LabelInputContainer>
                                    <Label htmlFor="depositRefundableVisa">Deposit Refundable (Visa)</Label>
                                    <Input
                                        id="depositRefundableVisa"
                                        name="depositRefundableVisa"
                                        defaultValue={(program as ProgramDetails)?.depositRefundableVisa || ""}
                                        placeholder="Deposit refund policy"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-300 mt-6">Career Prospects</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <LabelInputContainer>
                                    <Label htmlFor="keyCompaniesHiring">Key Companies Hiring</Label>
                                    <Input
                                        id="keyCompaniesHiring"
                                        name="keyCompaniesHiring"
                                        defaultValue={(program as ProgramDetails)?.keyCompaniesHiring || ""}
                                        placeholder="Key companies hiring"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="keyJobRoles">Key Job Roles</Label>
                                    <Input
                                        id="keyJobRoles"
                                        name="keyJobRoles"
                                        defaultValue={(program as ProgramDetails)?.keyJobRoles || ""}
                                        placeholder="Key job roles"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="quantQualitative">Quantitative/Qualitative</Label>
                                    <Input
                                        id="quantQualitative"
                                        name="quantQualitative"
                                        defaultValue={(program as ProgramDetails)?.quantQualitative || ""}
                                        placeholder="Quantitative/Qualitative aspects"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>
                        </div>

                        <SubmitButton isEditing={isEditing} />
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddProgram;