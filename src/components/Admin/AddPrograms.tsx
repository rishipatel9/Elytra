'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LabelInputContainer } from '../LabelInputContainer';
import { Input } from '../ui/input';
import { PlusIcon } from '@/icons/icons';
import { useFormStatus } from 'react-dom';
import clsx from 'clsx';
import { createProgram } from '@/actions/onProgramInfo';



function SubmitButton() {
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
                    Creating...
                </span>
            ) : (
                "Create Program"
            )}
        </Button>
    );
}

const AddProgram = () => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState<{ [key: string]: string }>({});

    const validateNumber = (value: string, fieldName: string) => {
        if (value === '') return '';
        const num = Number(value);
        if (isNaN(num)) return `${fieldName} must be a number`;
        if (num < 0) return `${fieldName} cannot be negative`;
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validate numerical fields
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
            const error = validateNumber(value, field);
            if (error) errors[field] = error;
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error('Please fix the form errors before submitting');
            return;
        }

        try {
            const result = await createProgram(formData);

            if (result.success) {
                toast.success('Program created successfully!');
                setIsDialogOpen(false);
                router.refresh();
                // Trigger a refetch in ProgramsGrid
                const event = new CustomEvent('programUpdated');
                window.dispatchEvent(event);
            } else {
                toast.error(result.error || 'Failed to create program');
            }
        } catch (error) {
            console.error('Error creating program:', error);
            toast.error('Failed to create program');
        }
    }

    return (
        <div className={clsx({ 'blur-background': isDialogOpen })}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="flex items-center px-6 py-3 md:px-8 bg-white text-[#2D2D2D] font-medium rounded-md hover:bg-[#f0f0f0] h-[2.5rem]">
                        <span className="h-5 w-5 md:hidden">
                            <PlusIcon />
                        </span>
                        <span className="hidden md:inline">Create</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] rounded-md bg-[#151723] text-white border-2 border-[#2D2D2D] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Create New Program</DialogTitle>
                        <DialogDescription>
                            Enter the details for your new program.
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
                                        placeholder="Enter program name"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        placeholder="Program description"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="ranking">Ranking</Label>
                                    <Input
                                        id="ranking"
                                        name="ranking"
                                        type="number"
                                        min="0"
                                        placeholder="Enter program ranking"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.ranking && (
                                        <span className="text-red-500 text-sm">{formErrors.ranking}</span>
                                    )}
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="university">University</Label>
                                    <Input
                                        id="university"
                                        name="university"
                                        placeholder="Enter university name"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            {/* Program Details Column */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-300">Program Details</h2>
                                <LabelInputContainer>
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        placeholder="Program duration"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
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
                                        min="0"
                                        placeholder="Program fees"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.fees && (
                                        <span className="text-red-500 text-sm">{formErrors.fees}</span>
                                    )}
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="mode">Mode</Label>
                                    <Input
                                        id="mode"
                                        name="mode"
                                        placeholder="Program mode (Online/Offline)"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            {/* Eligibility and Location Details Spanning Two Columns */}
                            <div className="col-span-2 space-y-6">
                                <h2 className="text-xl font-semibold text-gray-300">Eligibility Criteria</h2>
                                <LabelInputContainer>
                                    <Label htmlFor="eligibility">Eligibility</Label>
                                    <Input
                                        id="eligibility"
                                        name="eligibility"
                                        placeholder="Eligibility requirements"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            {/* Location and University Details */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-300">Location Details</h2>
                                <LabelInputContainer>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="Program location"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="specialLocationFeatures">Special Location Features</Label>
                                    <Input
                                        id="specialLocationFeatures"
                                        name="specialLocationFeatures"
                                        placeholder="Special features of the location"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-300">University Details</h2>
                                <LabelInputContainer>
                                    <Label htmlFor="specialUniversityFeatures">Special University Features</Label>
                                    <Input
                                        id="specialUniversityFeatures"
                                        name="specialUniversityFeatures"
                                        placeholder="Special features of the university"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="usp">USP</Label>
                                    <Input
                                        id="usp"
                                        name="usp"
                                        placeholder="Unique Selling Proposition"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input
                                        id="specialization"
                                        name="specialization"
                                        placeholder="Program specialization"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                    />
                                </LabelInputContainer>
                            </div>

                            {/* Additional Fields */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-300">Additional Details</h2>
                                <LabelInputContainer>
                                    <Label htmlFor="applicationFee">Application Fee</Label>
                                    <Input
                                        id="applicationFee"
                                        name="applicationFee"
                                        type="number"
                                        min="0"
                                        placeholder="Application fee amount"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.applicationFee && (
                                        <span className="text-red-500 text-sm">{formErrors.applicationFee}</span>
                                    )}
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="deposit">Deposit</Label>
                                    <Input
                                        id="deposit"
                                        name="deposit"
                                        type="number"
                                        min="0"
                                        placeholder="Deposit amount"
                                        className="bg-[#1c1e2d] border-[#2D2D2D] text-lg py-3 px-4 w-full"
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.deposit && (
                                        <span className="text-red-500 text-sm">{formErrors.deposit}</span>
                                    )}
                                </LabelInputContainer>
                            </div>

                            {/* Submit Button */}
                            <SubmitButton />
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddProgram;