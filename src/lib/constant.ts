export const AVATARS = [
  {
    avatar_id: "Eric_public_pro2_20230608",
    name: "Edward in Blue Shirt",
  },
  {
    avatar_id: "Tyler-incasualsuit-20220721",
    name: "Tyler in Casual Suit",
  },
  {
    avatar_id: "Anna_public_3_20240108",
    name: "Anna in Brown T-shirt",
  },
  {
    avatar_id: "Susan_public_2_20240328",
    name: "Susan in Black Shirt",
  },
  {
    avatar_id: "josh_lite3_20230714",
    name: "Joshua Heygen CEO",
  },
];

export const STT_LANGUAGE_LIST = [
  { label: 'Bulgarian', value: 'bg', key: 'bg' },
  { label: 'Chinese', value: 'zh', key: 'zh' },
  { label: 'Czech', value: 'cs', key: 'cs' },
  { label: 'Danish', value: 'da', key: 'da' },
  { label: 'Dutch', value: 'nl', key: 'nl' },
  { label: 'English', value: 'en', key: 'en' },
  { label: 'Finnish', value: 'fi', key: 'fi' },
  { label: 'French', value: 'fr', key: 'fr' },
  { label: 'German', value: 'de', key: 'de' },
  { label: 'Greek', value: 'el', key: 'el' },
  { label: 'Hindi', value: 'hi', key: 'hi' },
  { label: 'Hungarian', value: 'hu', key: 'hu' },
  { label: 'Indonesian', value: 'id', key: 'id' },
  { label: 'Italian', value: 'it', key: 'it' },
  { label: 'Japanese', value: 'ja', key: 'ja' },
  { label: 'Korean', value: 'ko', key: 'ko' },
  { label: 'Malay', value: 'ms', key: 'ms' },
  { label: 'Norwegian', value: 'no', key: 'no' },
  { label: 'Polish', value: 'pl', key: 'pl' },
  { label: 'Portuguese', value: 'pt', key: 'pt' },
  { label: 'Romanian', value: 'ro', key: 'ro' },
  { label: 'Russian', value: 'ru', key: 'ru' },
  { label: 'Slovak', value: 'sk', key: 'sk' },
  { label: 'Spanish', value: 'es', key: 'es' },
  { label: 'Swedish', value: 'sv', key: 'sv' },
  { label: 'Turkish', value: 'tr', key: 'tr' },
  { label: 'Ukrainian', value: 'uk', key: 'uk' },
  { label: 'Vietnamese', value: 'vi', key: 'vi' },
];


export function generateStudentDetails(student: any): string {
  return `
    Meet **${student.name || "the student"}**, a ${student.age || "N/A"}-year-old aspiring **${
    student.careerAspirations || "N/A"
  }**, pursuing **${student.currentEducationLevel || "N/A"}** with grades **${
    student.grades || "N/A"
  }** in **${student.previousDegree || "N/A"}**. 
    
    A citizen of **${student.nationality || "N/A"}**, ${student.name} prefers **${
    student.preferredPrograms || "N/A"
  }** programs in **${student.preferredCountries || "N/A"}**. 
    
    Contact: **${student.email || "N/A"}** | **${student.phone || "N/A"}**. ${
    student.filledApplication ? "Application completed." : "Application pending."
  } ${
    student.visaQuestions && student.visaQuestions !== "None"
      ? `Visa questions: **${student.visaQuestions}**.`
      : ""
  }
    Updated on **${new Date(student.updatedAt).toLocaleDateString()}**.
  `;
}
