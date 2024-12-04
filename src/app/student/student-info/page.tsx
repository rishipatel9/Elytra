import React from "react";
import StudentInformationForm from "../_components/StudentInformation";
import { getUserDetails } from "@/utils"; 
import axios from "axios";
import { redirect } from "next/navigation";

const StudentInfo = async () => {
  try {
    const session = await getUserDetails();
    if (!session) {
      return <div>Unauthorized</div>;
    }
    const user=session.user;
    // console.log(user)
    const response = await axios.post(`http://localhost:3000/api/student/filled`,{
      id:user.id,
      email:user.email,
      name:user.name
    });
    console.log(response.data)
    if(response.data.filled){
      redirect("/dashboard")
    }else if(response.data.filled==false){
      return <StudentInformationForm />;
    }
    return null
  } catch (error) {
    console.log(error)
    return <div>Error: </div>;
  }
};

export default StudentInfo;
