'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from '@radix-ui/react-label';
import  { InputDemo, InputTags, NationalitySelect, SelectDemo, TextArea } from '@/components/ui/origin';
import { Tag } from 'emblor';
import { uploadStudentInfo } from '@/actions/onStudentInfo';
import { toast, Toaster } from 'sonner';

interface StudentData {
  name: string;
  phone: string;
  age: number;
  nationality: string;
  previousDegree: string;
  grades: string;
  currentEducationLevel: string;
  preferredCountries: string[];
  preferredPrograms: string;
  careerAspirations: string;
  visaQuestions?: string;
}

const StudentDataForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentData>({
    name: '',
    phone: '',
    age: 0,
    nationality: '',
    previousDegree: '',
    grades: '',
    currentEducationLevel: '',
    preferredCountries: [],
    preferredPrograms: '',
    careerAspirations: '',
    visaQuestions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (tags: Tag[]) => {
    const tagTexts = tags.map((tag) => tag.text);
    setFormData((prev) => ({
      ...prev,
      preferredCountries: tagTexts, 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Form Data:', formData);
  };

  async function handleFormAction(formdata:FormData) {
    const data = {
      name: formdata.get('name') as string,
      phone: formdata.get('phone') as string,
      age: Number(formdata.get('age')),
      nationality: formdata.get('nationality') as string,
      previousDegree: formdata.get('previousDegree') as string,
      grades: formdata.get('grades') as string,
      currentEducationLevel: formdata.get('currentEducationLevel') as string,
      preferredCountries: formdata.getAll('preferredCountries') as string[],
      preferredPrograms: formdata.get('preferredPrograms') as string,
      careerAspirations: formdata.get('careerAspirations') as string,
      visaQuestions: formdata.get('visaQuestions') as string
    };

    const response = await uploadStudentInfo(data);
    console.log('Response:', response)
    if(response){
      toast.success('Student Information Uploaded Successfully');
    }
    else{
      toast.error('Error uploading student information');
    }

    console.log('Form Data:', data);
  }

  return (
    <div className="h-full w-full mx-auto p-6 flex justify-center items-center bg-[#0A0A0B] shadow-lg">
      <div className="container max-w-4xl space-y-6 text-left border p-4 border-[#2D2D2D] rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Student Information Form
        </h1>
        <form action={handleFormAction} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Personal Details</h2>
              <InputDemo
                id="name"
                label="Name"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputDemo
                id="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <InputDemo
                id="age"
                label="Age"
                placeholder="Enter your age"
                name="age"
                value={formData.age.toString()}
                onChange={handleChange}
              />
              <NationalitySelect
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={(value) => handleSelectChange("nationality", value)}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Academic Background</h2>
              <InputDemo
                id="previousDegree"
                label="Previous Degree"
                placeholder="Degree you've completed"
                name="previousDegree"
                value={formData.previousDegree}
                onChange={handleChange}
              />
              <InputDemo
                id="grades"
                label="Academic Grades"
                placeholder="Your overall grades/GPA"
                name="grades"
                value={formData.grades}
                onChange={handleChange}
              />
              <SelectDemo
                id="currentEducationLevel"
                name="currentEducationLevel"
                label="Current Education Level"
                options={["Bachelor's", "Masters", "PhD", "Other"]}
                value={formData.currentEducationLevel}
                onChange={(value) => handleSelectChange("currentEducationLevel", value)}
              />
              <InputTags
                id="preferredCountries"
                name="preferredCountries"
                label="Preferred Countries"
                value={formData.preferredCountries}
                onChange={handleTagsChange}
              />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-white">Study Preferences</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="careerAspirations" className="dark:text-gray-300">
                  Career Aspirations
                </Label>
                <TextArea
                label='Career Aspirations'
                  id="careerAspirations"
                  name="careerAspirations"
                  value={formData.careerAspirations}
                  onChange={handleChange}
                  placeholder="Describe your career aspirations"
                />
              </div>
              <div>
                <Label htmlFor="preferredPrograms" className="dark:text-gray-300">
                  Preferred Programs
                </Label>
                <TextArea
                  label='Preferred Programs'
                  id="preferredPrograms"
                  name="preferredPrograms"
                  value={formData.preferredPrograms}
                  onChange={handleChange}
                  placeholder="Enter your preferred programs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <TextArea
            label='Visa Questions'
              id="visaQuestions"
              name="visaQuestions"
              value={formData.visaQuestions || ""}
              onChange={handleChange}
              placeholder="Enter your visa-related questions"
            />
          </div>

          <div className="text-center mt-8">
            <Button type="submit" className="px-6 py-3 bg-white text-black mx-auto w-full">
              Submit
            </Button>
          </div>
          <Toaster/>
        </form>
      </div>
    </div>
  );
};

export default StudentDataForm;
