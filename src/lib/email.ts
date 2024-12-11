import { toast } from 'sonner';

interface HandleScheduleProps {
  session: any;
  selectedCounselorDetails: any;
  selectedDate: any;
  selectedTime: any;
  meetingType: any;
}

export const handleSchedule = async ({
  session,
  selectedCounselorDetails,
  selectedDate,
  selectedTime,
  meetingType,
}: HandleScheduleProps) => {
  const meetingDetails = {
    email: session?.user?.email || '',
    counselorName: selectedCounselorDetails?.name,
    date: selectedDate,
    time: selectedTime,
    meetingType,
  };

  console.log('Meeting scheduled:', meetingDetails);

  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingDetails),
    });

    // Handle the response
    if (response.ok) {
      toast.success('Meeting scheduled successfully');
    } else {
      toast.error('An error occurred. Please try again.');
    }
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    toast.error('An error occurred. Please try again.');
  }
};
