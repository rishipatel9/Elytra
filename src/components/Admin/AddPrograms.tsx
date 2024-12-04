'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { LabelInputContainer } from '../LabelInputContainer';
import { Input } from '../ui/input';
import { PlusIcon } from '@/icons/icons';

import { useFormStatus } from 'react-dom';
import { createProgram } from '@/actions/onProgram';

function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <Button
            type="submit"
            className="bg-white text-black w-full"
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

    async function handleFormAction(formData: FormData) {
        const response = await createProgram({
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            mode: formData.get('mode') as string,
            duration: formData.get('duration') as string,
            category: formData.get('category') as string,
            fees: formData.get('fees') as string,
            eligibility: formData.get('eligibility') as string,
        });

        if (response.success) {
            toast.success(response.message);
            setIsDialogOpen(false);
            router.refresh(); // Refresh the page to show new data
            // Reset form
            const form = document.querySelector('form') as HTMLFormElement;
            form?.reset();
        } else {
            toast.error(response.message);
        }
    }

    return (
        <div className={clsx({ 'blur-background': isDialogOpen })}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="flex items-center px-4 py-2 md:px-8 bg-white text-[#2D2D2D] font-medium rounded-md hover:bg-[#f0f0f0] h-[2.5rem]">
                        <span className="h-5 w-5 md:hidden">
                            <PlusIcon />
                        </span>
                        <span className="hidden md:inline">Create</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-md bg-[#151723] text-white border-2 border-[#2D2D2D]">
                    <DialogHeader>
                        <DialogTitle>Create New Program</DialogTitle>
                        <DialogDescription>
                            Enter the details for your new program.
                        </DialogDescription>
                    </DialogHeader>
                    <form action={handleFormAction} className="py-4">
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="name">Program Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="Enter program name"
                                className="bg-[#1c1e2d] border-[#2D2D2D]"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="Brief description of the program"
                                className="bg-[#1c1e2d] border-[#2D2D2D]"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="mode">Mode</Label>
                            <Input
                                id="mode"
                                name="mode"
                                placeholder="E.g., Online, Offline, Hybrid"
                                className="bg-[#1c1e2d] border-[#2D2D2D]"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                name="duration"
                                placeholder="E.g., 6 months"
                                className="bg-[#1c1e2d] border-[#2D2D2D]"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="E.g., Web Development, Data Science"
                                className="bg-[#1c1e2d] border-[#2D2D2D]"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="fees">Fees</Label>
                            <Input
                                id="fees"
                                name="fees"
                                placeholder="E.g., $1000"
                                className="bg-[#1c1e2d] border-[#2D2D2D]"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="eligibility">Eligibility</Label>
                            <Input
                                id="eligibility"
                                name="eligibility"
                                placeholder="E.g., Graduate, Beginner"
                                className="bg-[#1c1e2d] border-[#2D2D2D]"
                            />
                        </LabelInputContainer>

                        <DialogFooter>
                            <SubmitButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddProgram;