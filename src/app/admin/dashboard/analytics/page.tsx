'use client'
import Analytics from '@/components/Admin/analytics/Analytics';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const page = () => {
    // const [programData, setProgramData] = useState([]);
    // useEffect(() => {
    //     const getPrograms=async ()=>{
    //         const response=await axios.get("/api/programs");
    //         console.log(response.data.programs);
    //         setProgramData(response.data.programs);
    //     }  
    //     getPrograms();
    // },[])
  return (
    <Analytics/>
  )
}

export default page
