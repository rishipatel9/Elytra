'use client'
import { useState } from "react";
import { useFormik } from "formik";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validateEmail, validatePhone } from "@/utils/validation";

import { createStudent } from "../../helper/student/index";
import { useRouter } from "next/navigation";

interface StudentData {
  name: string;
  email: string;
  phone: string;
  age: number; // Note: age is a number
  nationality: string;
  previousDegree: string;
  grades: string;
  currentEducationLevel: string;
  preferredCountries: string;
  preferredPrograms: string;
  careerAspirations: string;
  visaQuestions?: string;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  age: string; // Formik will treat all inputs as strings
  nationality: string;
  previousDegree: string;
  grades: string;
  currentEducationLevel: string;
  preferredCountries: string;
  preferredPrograms: string;
  careerAspirations: string;
  visaQuestions: string;
}

const educationLevels = [
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
];

export default function StudentInformationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router=useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      nationality: "",
      previousDegree: "",
      grades: "",
      currentEducationLevel: "",
      preferredCountries: "",
      preferredPrograms: "",
      careerAspirations: "",
      visaQuestions: "",
    },
    validate: (values) => {
      const errors: Partial<FormValues> = {};
      if (!values.name) errors.name = "Required";
      if (!values.email) {
        errors.email = "Required";
      } else if (!validateEmail(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.phone) {
        errors.phone = "Required";
      } else if (!validatePhone(values.phone)) {
        errors.phone = "Invalid phone number";
      }
      if (!values.age) {
        errors.age = "Required";
      } else if (
        isNaN(Number(values.age)) ||
        Number(values.age) < 16 ||
        Number(values.age) > 100
      ) {
        errors.age = "Please enter a valid age between 16 and 100";
      }
      if (!values.nationality) errors.nationality = "Required";
      if (!values.previousDegree) errors.previousDegree = "Required";
      if (!values.grades) errors.grades = "Required";
      if (!values.currentEducationLevel)
        errors.currentEducationLevel = "Required";
      if (!values.preferredCountries) errors.preferredCountries = "Required";
      if (!values.preferredPrograms) errors.preferredPrograms = "Required";
      if (!values.careerAspirations) errors.careerAspirations = "Required";
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        // Convert FormValues to StudentData
        const studentData: StudentData = {
          ...values,
          age: Number(values.age), // Convert age to a number
        };

        // Call the createStudent function
        const response = await createStudent(studentData);
        console.log(response);
        if (response) {
          router.push("/dashboard");  
          // toast({
          //   title: "Form Submitted Successfully",
          //   description: "Thank you for your interest. We'll be in touch soon!",
          // });
        } else {
          toast({
            title: "Submission Failed",
            description: response.message || "Something went wrong!",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description:  "Something went wrong!",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Student Information Form</CardTitle>
        <CardDescription>
          Please fill out the following information to help us assist you better
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...formik.getFieldProps("name")}
                  className={
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-red-500">{formik.errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  className={
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...formik.getFieldProps("phone")}
                  className={
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-sm text-red-500">{formik.errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...formik.getFieldProps("age")}
                  className={
                    formik.touched.age && formik.errors.age
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.age && formik.errors.age && (
                  <p className="text-sm text-red-500">{formik.errors.age}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  {...formik.getFieldProps("nationality")}
                  className={
                    formik.touched.nationality && formik.errors.nationality
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.nationality && formik.errors.nationality && (
                  <p className="text-sm text-red-500">
                    {formik.errors.nationality}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Academic Background</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="previousDegree">Previous Degree</Label>
                <Input
                  id="previousDegree"
                  {...formik.getFieldProps("previousDegree")}
                  className={
                    formik.touched.previousDegree &&
                    formik.errors.previousDegree
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.previousDegree &&
                  formik.errors.previousDegree && (
                    <p className="text-sm text-red-500">
                      {formik.errors.previousDegree}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="grades">Grades</Label>
                <Input
                  id="grades"
                  {...formik.getFieldProps("grades")}
                  className={
                    formik.touched.grades && formik.errors.grades
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.grades && formik.errors.grades && (
                  <p className="text-sm text-red-500">{formik.errors.grades}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentEducationLevel">
                  Current Education Level
                </Label>
                <Select
                  onValueChange={(value) =>
                    formik.setFieldValue("currentEducationLevel", value)
                  }
                  defaultValue={formik.values.currentEducationLevel}
                >
                  <SelectTrigger
                    className={
                      formik.touched.currentEducationLevel &&
                      formik.errors.currentEducationLevel
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.currentEducationLevel &&
                  formik.errors.currentEducationLevel && (
                    <p className="text-sm text-red-500">
                      {formik.errors.currentEducationLevel}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Interests and Goals</h3>
            <div className="space-y-2">
              <Label htmlFor="preferredCountries">Preferred Countries</Label>
              <Input
                id="preferredCountries"
                {...formik.getFieldProps("preferredCountries")}
                className={
                  formik.touched.preferredCountries &&
                  formik.errors.preferredCountries
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.preferredCountries &&
                formik.errors.preferredCountries && (
                  <p className="text-sm text-red-500">
                    {formik.errors.preferredCountries}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredPrograms">
                Preferred Programs or Subjects
              </Label>
              <Input
                id="preferredPrograms"
                {...formik.getFieldProps("preferredPrograms")}
                className={
                  formik.touched.preferredPrograms &&
                  formik.errors.preferredPrograms
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.preferredPrograms &&
                formik.errors.preferredPrograms && (
                  <p className="text-sm text-red-500">
                    {formik.errors.preferredPrograms}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="careerAspirations">Career Aspirations</Label>
              <Textarea
                id="careerAspirations"
                {...formik.getFieldProps("careerAspirations")}
                className={
                  formik.touched.careerAspirations &&
                  formik.errors.careerAspirations
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.careerAspirations &&
                formik.errors.careerAspirations && (
                  <p className="text-sm text-red-500">
                    {formik.errors.careerAspirations}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="visaQuestions">
                Visa-related Questions (if any)
              </Label>
              <Textarea
                id="visaQuestions"
                {...formik.getFieldProps("visaQuestions")}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
